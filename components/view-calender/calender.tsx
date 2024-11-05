"use client";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import "@schedule-x/theme-default/dist/index.css";
import {
  CalendarEvent,
  viewDay,
  viewMonthAgenda,
  viewMonthGrid,
  viewWeek,
} from "@schedule-x/calendar";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createResizePlugin } from "@schedule-x/resize";
import { useQuery } from '@tanstack/react-query';
import { useSession } from "next-auth/react";
import { seededEvents } from "@components/view-calender/seeded-events";
import { useEffect, useState } from 'react';

function CalendarApp() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const fetchSchedule = async () => {
    const token = session?.user?.access_token;
    const email = session?.user?.email;
    if (!token || !email) throw new Error("Token or email not found");

    // Fetch workspace ID
    const responseWspId = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace/filter-workspaces?email=${email}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!responseWspId.ok) {
      const errorResponse = await responseWspId.text();
      throw new Error(`Failed to fetch workspaces: ${errorResponse}`);
    }

    const workspaces = await responseWspId.json();
    const workspaceId = workspaces[0]?.ID;

    if (!workspaceId) {
      throw new Error("No workspace ID found");
    }

    // Fetch events using workspaceId
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedule/schedule?workspace_id=${workspaceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(`Failed to fetch events: ${errorResponse}`);
    }

    const result = await response.json();
    // Transform data into the required format
    const transformedEvents = result.map((event: Event) => ({
      id: event.id.toString(),
      title: event.title,
      description: event.description || "",
      start: event.start_time.substring(0, 16).replace("T", " "),
      end: event.end_time.substring(0, 16).replace("T", " "),
      location: event.location || "",
      color: "blue",
      isEditable: true,
      allDay: event.all_day,
    }));

    console.log("Events:", transformedEvents);
    return transformedEvents; // Return the transformed event array
  };

  interface Event {
    id: number;
    workspace_id: number;
    board_column_id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    start: string;
    end: string;
    location: string;
    created_by: number;
    created_at: string;
    updated_at: string;
    status: string;
    all_day: boolean;
    visibility: string;
    video_transcript: string | null;
    extra_data: string;
    is_deleted: boolean;
    recurrence_pattern: string;
    position: number;
    color: string;
    priority: string;
  }

  const { data: fetchedEvents, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchSchedule,
    onSuccess: (data) => {
      const mappedEvents = mapEventDates(data);
      setEvents(mappedEvents); // Set events state with mapped events
    },
  });

  const mapEventDates = (events: Event[]): CalendarEvent[] => {
    return events.map((event) => ({
      id: event.id.toString(),
      title: event.title,
      with: event.created_by?.toString() || "Unknown",
      start: event.start_time,
      end: event.end_time,
      isEditable: true,
      allDay: event.all_day,
      description: event.description || "",
      location: event.location || "",
      color: event.color || "blue",
    }));
  };

  const calendarApp = useNextCalendarApp({
    views: [viewWeek, viewMonthAgenda, viewDay, viewMonthGrid],
    defaultView: viewMonthGrid.name,
    events: events.length > 0 ? events : seededEvents,
    plugins: [
      createDragAndDropPlugin(),
      createEventModalPlugin(),
      createResizePlugin(),
    ],
    selectedDate: "2024-09-01",
  });

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Error state
  }

  if (!calendarApp) {
    return <div>Error: Calendar App not initialized</div>; // Error state
  }

  return (
      <div className="w-full max-w-[100vw] h-[800px] max-h-[90vw]">
        <ScheduleXCalendar calendarApp={calendarApp} />
      </div>
  );
}

export default CalendarApp;
