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

  // Định nghĩa type cho Event để tái sử dụng
  interface Event {
    id: number;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    location?: string;
    all_day: boolean;
    created_by?: number;
    color?: string;
  }

  // Hàm chuyển đổi dữ liệu sự kiện sang định dạng `CalendarEvent`
  const mapEventDates = (events: Event[]): CalendarEvent[] => {
    const mapEven = events.map((event) => ({
      id: event.id.toString(),
      title: event.title,
      description: event.description || "",
      start: event.start_time.substring(0, 16).replace("T", " "),
      end: event.end_time.substring(0, 16).replace("T", " "),
      location: event.location || "",
      color: event.color || "blue",
      isEditable: true,
      allDay: event.all_day,
    });
    cons
    return mapEven;
  };

  // Hàm fetch lịch
  const fetchSchedule = async () => {
    const token = session?.user?.access_token;
    const email = session?.user?.email;
    if (!token || !email) throw new Error("Token or email not found");

    // Fetch workspace ID
    const workspaceResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace/filter-workspaces?email=${email}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!workspaceResponse.ok) {
      throw new Error(`Failed to fetch workspaces: ${await workspaceResponse.text()}`);
    }

    const workspaces = await workspaceResponse.json();
    const workspaceId = workspaces[0]?.ID;
    if (!workspaceId) throw new Error("No workspace ID found");

    // Fetch events
    const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedule/schedule?workspace_id=${workspaceId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!eventsResponse.ok) {
      throw new Error(`Failed to fetch events: ${await eventsResponse.text()}`);
    }

    const result = await eventsResponse.json();
    console.log("Fetch respone", result);
    return mapEventDates(result); // Return transformed events array
  };

  // useQuery để fetch data và cập nhật state `events`
  const { isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchSchedule,
    onSuccess: (data) => {
      setEvents(data);
    },
    onError: (err) => {
      console.error("Error fetching events:", err);
    },
  });

  console.log("Event", events)
  // Sử dụng `events` để khởi tạo `calendarApp`
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
      <div className="w-full max-w-[100vw] h-[800px] max-h-[90vw]">
        <ScheduleXCalendar calendarApp={calendarApp} />
      </div>
  );
}

export default CalendarApp;
