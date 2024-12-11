import { EventSorter } from "../src/index";

enum EventId {
  First = 1,
  Second = 2,
  Third = 3,
  Fourth = 4,
}

describe("EventSorter", () => {
  describe("when schedule event called", () => {
    it("order of events corresponds to the configuration", () => {
      // Given
      const requiredOrderOfEvents = [
        EventId.First,
        EventId.Second,
        EventId.Third,
        EventId.Fourth,
      ];
      const eventSorter = new EventSorter<EventId>(requiredOrderOfEvents);
      const result: EventId[] = [];

      // When
      eventSorter.scheduleInitialEvent(EventId.First, () =>
        result.push(EventId.First)
      );
      eventSorter.scheduleInitialEvent(EventId.Fourth, () =>
        result.push(EventId.Fourth)
      );
      eventSorter.scheduleInitialEvent(EventId.Third, () =>
        result.push(EventId.Third)
      );
      eventSorter.scheduleInitialEvent(EventId.Second, () =>
        result.push(EventId.Second)
      );

      // Then
      expect(result).toStrictEqual(requiredOrderOfEvents);
    });
  });
});
