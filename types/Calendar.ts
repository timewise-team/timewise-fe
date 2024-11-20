export interface Schedule {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    location: string;
    all_day: boolean;
}

export interface TransformedSchedule {
    id: string;
    title: string;
    with: string;
    start: string;
    end: string;
    color: string;
    isEditable: boolean;
    location: string;
    topic: string;
}
