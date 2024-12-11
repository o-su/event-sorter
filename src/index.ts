/**
 * Event Sorter
 * ensures that events are processed in the correct order and that no events are lost
 * if they are scheduled before the required state is reached
 */
export class EventSorter<T extends number> {
  private currentState: T | undefined = undefined;

  private initialEvents: { [key in T]?: (() => void) | undefined } = {};
  private events: (() => void)[] = [];
  private lock: { [key in T]?: boolean } = {};
  private requiredStates: T[] = [];

  /**
   * @param requiredStates - required initial states in the order they should be processed
   */
  constructor(requiredStates: T[]) {
    this.requiredStates = requiredStates;
  }

  /**
   * Schedules an event to be processed when the required state is reached
   * @param state - required state for the event to be processed
   * @param gtmEvent - event to be processed
   */
  scheduleInitialEvent = (state: T, gtmEvent: () => void) => {
    if (this.isInitialized()) {
      this.events.forEach((event) => event());

      if (!this.isEventLocked(state)) {
        gtmEvent();
        this.lockEvent(state);
      }
    } else {
      const eventEnabled = this.currentState
        ? state <= this.currentState
        : state === this.requiredStates[0];

      if (eventEnabled) {
        if (!this.isEventLocked(state)) {
          gtmEvent();
          this.lockEvent(state);
          this.currentState = this.findNextState(state);
        }
      } else {
        this.initialEvents[state] = gtmEvent;
      }

      this.processPreviousEvents();
    }
  };

  scheduleEvent = (gtmEvent: () => void) => {
    if (this.isInitialized()) {
      gtmEvent();
    } else {
      this.events.push(gtmEvent);
    }
  };

  isInitialized = (): boolean =>
    this.requiredStates.length > 0
      ? this.currentState ===
        this.requiredStates[this.requiredStates.length - 1]
      : true;

  /*
   * Processes all events that were scheduled before the required state was reached
   */
  private processPreviousEvents = () => {
    for (let state in this.initialEvents) {
      const stateId = parseInt(state, 10);
      const stateEnabled = this.currentState
        ? stateId <= this.currentState
        : stateId === this.requiredStates[0];

      if (this.initialEvents[stateId as T] && stateEnabled) {
        this.processPreviousEvent(stateId as T);
      }
    }
  };

  private processPreviousEvent = (stateId: T) => {
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

  private clearBufferedEvent = (state: T) => {
    this.initialEvents[state] = undefined;
  };

  private findNextState = (state: T): T => {
    const index = this.requiredStates.findIndex(
      (requiredState) => requiredState === state
    );

    return index < this.requiredStates.length - 1
      ? this.requiredStates[index + 1]
      : state;
  };

  private isEventLocked = (state: T): boolean => !!this.lock[state];

  private lockEvent = (state: T) => {
    this.lock[state] = true;
  };
}
