/* eslint-disable @typescript-eslint/no-explicit-any */

import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {format, parseISO} from "date-fns";
import {Gauge, Pencil} from "lucide-react";
import {useSession} from "next-auth/react";
import {useParams} from "next/navigation";
import React, {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {z} from "zod";
import {Form} from "../ui/form";
import {updateReminderParticipant} from "@/lib/fetcher";
import {getUserEmailByWorkspace} from "@/utils/userUtils";
import {useStateContext} from "@/stores/StateContext";

interface Props {
    data: any;
    disabled?: boolean;
}

export const Reminder = z.object({
    reminder_time: z.string(),
});

const AllReminder = ({data, disabled}: Props) => {
    const [reminderTime] = useState(
        data?.reminder_time
            ? format(parseISO(data.reminder_time), "yyyy-MM-dd HH:mm")
            : ""
    );
    const formRef = useRef<HTMLFormElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const params = useParams();
    const {data: session} = useSession();
    const queryClient = useQueryClient();
    const {stateWorkspacesByEmail, stateUserEmails} = useStateContext();

    const form = useForm<z.infer<typeof Reminder>>({
        resolver: zodResolver(Reminder),
        defaultValues: {
            ...data,
            reminder_time: reminderTime,
        },
    });

    const disableEditing = () => {
        setIsEditing(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
            setIsEditing(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const {register} = form;

    const {mutate: updateReminderParticipants} = useMutation({
        mutationFn: async (values: z.infer<typeof Reminder>) => {
            const userEmail = getUserEmailByWorkspace(stateUserEmails, stateWorkspacesByEmail, Number(params.organizationId || data.workspaceId));
            if (!userEmail) {
                return null;
            }

            const response = await updateReminderParticipant(
                {
                    reminder_id: data.ID,
                    reminder_time: values.reminder_time,
                    schedule_id: data.schedule_id,
                    organizationId: params.organizationId || data.workspaceId,
                    userEmail: userEmail.email,
                },
                session
            );

            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["allReminder"],
            });
            disableEditing();

            toast.success("Schedule updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "An error occurred");
        },
    });

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updateReminderParticipants({reminder_time: event.target.value});
    };

    return (
        <>
            <Form {...form}>
                {isEditing ? (
                    <form ref={formRef}>
                        <div className="flex flex-row items-center gap-x-3">
                            <p className="text-sm font-medium">Set Reminder:</p>
                            <select
                                {...register("reminder_time")}
                                onChange={handleSelectChange}
                            >
                                <option value={"0"}>Until start</option>
                                <option value={"60"}>1 hour before</option>
                                <option value={"120"}>2 hours before</option>
                            </select>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="flex items-center gap-x-2">
                            <div className="flex flex-row items-center gap-x-1">
                                <Gauge className="h-4 w-4 mr-2  "/>
                                <p className="text-sm font-bold text-gray-400">Participant: </p>
                                <p className="text-sm text-neutral-500">
                                    {reminderTime
                                        ? format(parseISO(reminderTime), "yyyy-MM-dd HH:mm")
                                        : "No reminder set"}
                                </p>
                            </div>

                            <div className="flex flex-row items-center gap-x-1 cursor-pointer">
                                <Pencil
                                    className="w-4 h-4"
                                    onClick={() => {
                                        if (disabled) return;
                                        setIsEditing(true);
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
};

export default AllReminder;
