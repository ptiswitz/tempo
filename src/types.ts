export interface CurrentTask {
    id: string;
    name: string;
    startTime: number; // Timestamp when the task initially started
    lastResumeTime: number; // Timestamp of the most recent resume
    elapsedSeconds: number; // Total elapsed time including pauses
    accumulatedSeconds: number; // Time accumulated before the current session
    isPaused: boolean;
}

export interface CompletedTask {
    id: string;
    name: string;
    startTime: number;
    endTime: number;
    durationSeconds: number;
}
