"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSorter = void 0;
/**
 * Event Sorter
 * ensures that events are processed in the correct order and that no events are lost
 * if they are scheduled before the required state is reached
 */
class EventSorter {
    /**
     * @param requiredStates - required initial states in the order they should be processed
     */
    constructor(requiredStates) {
        this.currentState = undefined;
        this.initialEvents = {};
        this.events = [];
        this.lock = {};
        this.requiredStates = [];
        /**
         * Schedules an event to be processed when the required state is reached
         * @param state - required state for the event to be processed
         * @param gtmEvent - event to be processed
         */
        this.scheduleInitialEvent = (state, gtmEvent) => {
            if (this.isInitialized()) {
                this.events.forEach((event) => event());
                if (!this.isEventLocked(state)) {
                    gtmEvent();
                    this.lockEvent(state);
                }
            }
            else {
                const eventEnabled = this.currentState
                    ? state <= this.currentState
                    : state === this.requiredStates[0];
                if (eventEnabled) {
                    if (!this.isEventLocked(state)) {
                        gtmEvent();
                        this.lockEvent(state);
                        this.currentState = this.findNextState(state);
                    }
                }
                else {
                    this.initialEvents[state] = gtmEvent;
                }
                this.processPreviousEvents();
            }
        };
        this.scheduleEvent = (gtmEvent) => {
            if (this.isInitialized()) {
                gtmEvent();
            }
            else {
                this.events.push(gtmEvent);
            }
        };
        this.isInitialized = () => this.requiredStates.length > 0
            ? this.currentState ===
                this.requiredStates[this.requiredStates.length - 1]
            : true;
        /*
         * Processes all events that were scheduled before the required state was reached
         */
        this.processPreviousEvents = () => {
            for (let state in this.initialEvents) {
                const stateId = parseInt(state, 10);
                const stateEnabled = this.currentState
                    ? stateId <= this.currentState
                    : stateId === this.requiredStates[0];
                if (this.initialEvents[stateId] && stateEnabled) {
                    this.processPreviousEvent(stateId);
                }
            }
        };
        this.processPreviousEvent = (stateId) => {
            const event = this.initialEvents[stateId];
            const updateRequired = this.currentState && stateId >= this.currentState;
            if (event) {
                event();
                this.clearBufferedEvent(stateId);
            }
            if (updateRequired) {
                this.currentState = this.findNextState(stateId);
                this.processPreviousEvents();
            }
        };
        this.clearBufferedEvent = (state) => {
            this.initialEvents[state] = undefined;
        };
        this.findNextState = (state) => {
            const index = this.requiredStates.findIndex((requiredState) => requiredState === state);
            return index < this.requiredStates.length - 1
                ? this.requiredStates[index + 1]
                : state;
        };
        this.isEventLocked = (state) => !!this.lock[state];
        this.lockEvent = (state) => {
            this.lock[state] = true;
        };
        this.requiredStates = requiredStates;
    }
}
exports.EventSorter = EventSorter;
