export interface CurrentTask {
    id: string;
    name: string;
    startTime: number; // Store as timestamp (Date.now())
    elapsedSeconds: number;
}

export interface CompletedTask {
    id: string;
    name: string;
    startTime: number;
    endTime: number;
    durationSeconds: number;
}
