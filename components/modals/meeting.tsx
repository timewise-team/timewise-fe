/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {ElementRef, useEffect, useRef, useState, useTransition} from "react";
import Image from "next/image";
import {format} from "date-fns";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {useParams} from "next/navigation";
import {useForm} from "react-hook-form";
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

interface RawTranscriptDTO {
    raw_transcript: {
        raw_transcript: string;
        summary: string;
    };
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
    const [summary, setSummary] = useState<string | null>(null);

    const form = useForm<z.infer<typeof UpdateCard>>({
        resolver: zodResolver(UpdateCard),
        defaultValues: {
            ...data,
        },
    });

    const {register} = form;


    useEffect(() => {
        if (data?.video_transcript) {
            const transcriptData: RawTranscriptDTO = JSON.parse(data.video_transcript);
            setSummary(transcriptData?.raw_transcript?.summary || null);
        }
    }, [data]);

    const {mutate: triggerMeetingMutation} = useMutation({
        mutationFn: async () => {
            console.log("triggerMeetingMutation", data.workspace_id);
            const userEmail = getUserEmailByWorkspace(stateUserEmails, stateWorkspacesByEmail, Number(data.workspace_id));
            if (!userEmail) {
                return null;
            }
            const response = await triggerMeeting(
                {
                    meet_link: data.location,
                    schedule_id: id,
                    workspace_id: data.workspace_id,
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
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-md">
            {/* Meeting Link Section */}
            <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                    <Image
                        src={"/images/icons/gg-meet.svg"}
                        alt="Google Meet Icon"
                        width={40}
                        height={40}
                        className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="font-semibold text-lg">Meeting Link</span>
                </div>
                {isEditing ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmission();
                        }}
                        className="flex items-center gap-x-2"
                    >
                        <Input
                            id="location"
                            disabled={isPending}
                            onKeyDown={handleEnterPress}
                            className="flex-grow min-h-[42px] bg-white border-gray-300 focus:ring focus:ring-blue-300 rounded-md"
                            placeholder="Add or edit the meeting link"
                            defaultValue={mettingLocation}
                            {...register("location")}
                        />
                        <Button type="submit" className="bg-blue-600 text-white">
                            Save
                        </Button>
                    </form>
                ) : (
                    <div
                        onClick={enableEditing}
                        role="button"
                        className="min-h-[42px] flex items-center gap-x-1 font-medium py-2 px-3 rounded-md bg-white border border-gray-300 cursor-pointer hover:shadow-sm"
                    >
                        {mettingLocation || "Click to add a meeting link"}
                        {data?.location && <Pencil className="w-4 h-4 ml-2 text-gray-600"/>}
                    </div>
                )}
            </div>

            {/* Video Transcript Section */}
            {summary && (
                <div className="space-y-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold">Meeting Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                </div>
            )}

            {/* Start Meeting Button */}
            <Button
                onClick={() => triggerMeetingMutation()}
                className="w-full bg-green-600 text-white hover:bg-green-700 transition-all"
            >
                Start Meeting
            </Button>
        </div>
    );
};

export default Meetting;
