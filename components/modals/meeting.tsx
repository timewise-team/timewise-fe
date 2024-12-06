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
import {Bot, HelpCircle, Info, Pencil, Video} from "lucide-react";
import {getUserEmailByWorkspace} from "@/utils/userUtils";
import {useStateContext} from "@/stores/StateContext";
import HintTool from "@components/hint-tool";
import {Slot} from "@radix-ui/react-slot";
import description from "@components/modals/description";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@components/ui/tooltip";

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
            queryClient.invalidateQueries({
                queryKey: ["schedules", data.workspace_id],
            });
            queryClient.invalidateQueries({
                queryKey: ["schedules"],
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
        <div className="max-h-[250px] overflow-auto space-y-2" style={{maxHeight:"250px"}}>
            {/* Meeting Link Section */}
            <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                    <Video/>
                    <span className="font-semibold text-lg">Meeting URL</span>
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger><Info className="w-4 h-4 text-gray-500"/></TooltipTrigger>
                            <TooltipContent
                                sideOffset={10}
                                side="top"
                                className="text-xs w-[320px] break-words"
                            >
                                <p className="font-semibold text-lg flex gap-2 items-center">
                                    AI Meeting Bot
                                    <Bot className="w-5 h-5"/>
                                </p>
                                <p className="text-sm">AI Meeting Bot automatically records your meeting, converts the
                                    audio to a transcript, and provides a detailed summary.</p>

                                <p className="font-semibold text-sm mt-1">Instruction</p>
                                <ul className="text-sm">
                                    <li>Enter the meeting URL</li>
                                    <li>Click 'Start Recording & Generate Summary</li>
                                    <li>Let the us handle the rest</li>
                                </ul>

                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
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
                        <Button type="submit" className="bg-gray-950 text-white">
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
                className={`w-full bg-gray-950 text-white transition-all ${summary ? "bg-gray-300" : ""}`}
                disabled={summary !== null}
            >
                Start Recording & Generate Summary
            </Button>
        </div>
    );
};

export default Meetting;
