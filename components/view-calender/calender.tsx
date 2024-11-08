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

  const mapEventDates = (events: Event[]): CalendarEvent[] => {
    console.log("Original events:", events); // Log sự kiện gốc trước khi ánh xạ

    const mappedEvents = events.map((event) => ({
      id: event.id.toString(),
      title: event.title,
      description: event.description || "",
      start: event.start_time.substring(0, 16).replace("T", " "),
      end: event.end_time.substring(0, 16).replace("T", " "),
      location: event.location || "",
      color: event.color || "blue",
      isEditable: true,
      allDay: event.all_day,
    }));

    console.log("Mapped events:", mappedEvents); // Log sự kiện sau khi ánh xạ

    return mappedEvents;
  };

  const fetchSchedule = async () => {
    const token = session?.user?.access_token;
    const email = session?.user?.email;
    if (!token || !email) throw new Error("Token or email not found");

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

    const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedule/schedule?workspace_id=${workspaceId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!eventsResponse.ok) {
      throw new Error(`Failed to fetch events: ${await eventsResponse.text()}`);
    }

    const result = await eventsResponse.json();
    console.log("Fetched events:", result); // Kiểm tra dữ liệu trả về từ API

    // Kiểm tra nếu dữ liệu không rỗng
    if (result && Array.isArray(result)) {
      return mapEventDates(result); // Nếu dữ liệu hợp lệ, map nó vào cấu trúc CalendarEvent
    }

    return [];
  };
  console.log("Session data:", session);
  const { isLoading, error } = useQuery({
    queryKey: ['events', session],
    queryFn: async () => {
      console.log("Fetching schedule..."); // Log khi gọi fetchSchedule
      return fetchSchedule();
    },
    onSuccess: (data) => {
      console.log("Mapped events onSuccess:", data); // Kiểm tra dữ liệu sau khi ánh xạ
      setEvents(data); // Lưu dữ liệu vào state
    },
    onError: (err) => {
      console.error("Error fetching events:", err);
    },
  });

  const calendarApp = useNextCalendarApp({
    views: [viewWeek, viewMonthAgenda, viewDay, viewMonthGrid],
    defaultView: viewMonthGrid.name,
    events: events.length > 0 ? events : seededEvents, // Sử dụng events đã fetch được thay vì seededEvents
    plugins: [
      createDragAndDropPlugin(),
      createEventModalPlugin(),
      createResizePlugin(),
    ],
    selectedDate: "2024-09-01",
  });

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị Loading khi đang fetch dữ liệu
  }

  if (error) {
    return <div>Error: {error?.message}</div>; // Hiển thị lỗi nếu có vấn đề khi fetch dữ liệu
  }

  return (
      <div className="w-full max-w-[100vw] h-[800px] max-h-[90vw]">
        {/* Chỉ render lịch khi events đã có dữ liệu */}
        {events.length > 0 ? (
            <ScheduleXCalendar calendarApp={calendarApp} />
        ) : (
            <div>Loading events...</div> // Hiển thị Loading events nếu chưa có dữ liệu
        )}
      </div>
  );
}

export default CalendarApp;
