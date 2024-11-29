/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {ElementRef, useRef, useState, useTransition} from "react";
import Image from "next/image";
import {format} from "date-fns";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {useParams} from "next/navigation";
import {Form, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Input} from "../ui/input";
import {triggerMeeting, updateCardID} from "@/lib/fetcher";
import {UpdateCard} from "@/actions/update-card/schema";
import {Button} from "../ui/Button";
import {Pencil} from "lucide-react";
import {getUserEmailByWorkspace} from "@/utils/userUtils";
import {useStateContext} from "@/stores/StateContext";

interface Props {
    session: any;
    data: any;
    scheduleId: string | undefined;
    disabled?: boolean;
}

const Meetting = ({session, data, scheduleId, disabled}: Props) => {
    const [mettingLocation, setMettingLocation] = useState(data?.location);
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();
    const params = useParams();
    const id = Number(scheduleId);
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef<ElementRef<"textarea">>(null);
    const {stateUserEmails, stateWorkspacesByEmail} = useStateContext();

    const form = useForm<z.infer<typeof UpdateCard>>({
        resolver: zodResolver(UpdateCard),
        defaultValues: {
            ...data,
        },
    });

    const {register} = form;

    const {mutate: triggerMeetingMutation} = useMutation({
        mutationFn: async () => {
            const userEmail = getUserEmailByWorkspace(stateUserEmails, stateWorkspacesByEmail, Number(params.workspace_id));
            if (!userEmail) {
                return null;
            }
            const response = await triggerMeeting(
                {
                    meet_link: data.location,
                    schedule_id: id,
                    workspace_id: params.workspace_id,
                    userEmail: userEmail.email
                },
                session
            );
            return response;
        },
    });

    const {mutate: updateCardInformation} = useMutation({
        mutationFn: async (values: z.infer<typeof UpdateCard>) => {
            const userEmail = getUserEmailByWorkspace(stateUserEmails, stateWorkspacesByEmail, Number(params.organizationId || data.workspace_id));
            const response = await updateCardID(
                {
                    cardId: data.id,
                    visibility: values.visibility,
                    all_day: values.all_day,
                    description: values.description,
                    end_time: format(
                        new Date(values.end_time),
                        "yyyy-MM-dd HH:mm:ss.SSS"
                    ),
                    extra_data: values.extra_data,
                    location: values.location,
                    priority: values.priority,
                    recurrence_pattern: values.recurrence_pattern,
                    start_time: format(
                        new Date(values.start_time),
                        "yyyy-MM-dd HH:mm:ss.SSS"
                    ),
                    status: values.status,
                    title: values.title,
                    organizationId: params.organizationId || data.workspace_id,
                    userEmail: userEmail?.email
                },
                session
            );
            return response;
        },
        onSuccess: (data) => {
            setMettingLocation(data.location);
            startTransition(() => {
                setIsEditing(false);
            });
            queryClient.invalidateQueries({
                queryKey: ["detailCard"],
            });
            queryClient.invalidateQueries({
                queryKey: ["listBoardColumns"],
            });

            toast.success("Meeting link updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSubmission = form.handleSubmit((values) => {
        updateCardInformation(values);
    });

    const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            form.handleSubmit((values) => updateCardInformation(values))();
        }
    };

    const enableEditing = () => {
        if (disabled) return;
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    };

    return (
        <>
            <div className="space-y-2 bg-white p-2 rounded-md">
                <div className="flex flex-row items-center gap-x-2">
                    <Image
                        src={"/images/icons/gg-meet.svg"}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="h-6 w-6 rounded-full object-cover"
                    />
                    <Form {...form}>
                        {isEditing ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmission();
                                }}
                                className="space-y-2 bg-white"
                            >
                                <Input
                                    id={"location"}
                                    disabled={isPending}
                                    onFocus={enableEditing}
                                    onKeyDown={handleEnterPress}
                                    className="min-h-[78px] w-full bg-white "
                                    placeholder="Add a meeting link"
                                    defaultValue={mettingLocation}
                                    {...register("location")}
                                />
                                <button type="submit"/>
                            </form>
                        ) : (
                            <>
                                <div
                                    onClick={enableEditing}
                                    role="button"
                                    className="min-h-[78px] flex flex-row gap-x-1 font-medium py-3 px-3.5 rounded-md"
                                >
                                    {mettingLocation}
                                    {data?.location && <Pencil className="w-4 h-4 ml-2"/>}
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
            <Button onClick={() => triggerMeetingMutation()} className="w-full mt-2">
                Start Meeting
            </Button>
        </>
    );
};

export default Meetting;
