/**
 * Event Sorter
 * ensures that events are processed in the correct order and that no events are lost
 * if they are scheduled before the required state is reached
 */
export declare class EventSorter<T extends number> {
    private currentState;
    private initialEvents;
    private events;
    private lock;
    private requiredStates;
    /**
     * @param requiredStates - required initial states in the order they should be processed
     */
    constructor(requiredStates: T[]);
    /**
     * Schedules an event to be processed when the required state is reached
     * @param state - required state for the event to be processed
     * @param gtmEvent - event to be processed
     */
    scheduleInitialEvent: (state: T, gtmEvent: () => void) => void;
    scheduleEvent: (gtmEvent: () => void) => void;
    isInitialized: () => boolean;
    private processPreviousEvents;
    private processPreviousEvent;
    private clearBufferedEvent;
    private findNextState;
    private isEventLocked;
    private lockEvent;
}
