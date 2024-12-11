# event-sorter

Simple event sorter that ensures the correct order of events.

```typescript
enum EventId {
  First = 1,
  Second = 2,
  Third = 3,
  Fourth = 4,
}

const requiredOrderOfEvents = [
  EventId.First,
  EventId.Second,
  EventId.Third,
  EventId.Fourth,
];

const eventSorter = new EventSorter<EventId>(requiredOrderOfEvents);

eventSorter.scheduleInitialEvent(EventId.First, () =>
  console.log("first event");
);
eventSorter.scheduleInitialEvent(EventId.Fourth, () =>
  console.log("fourth event");
);
eventSorter.scheduleInitialEvent(EventId.Third, () =>
  console.log("third event");
);
eventSorter.scheduleInitialEvent(EventId.Second, () =>
  console.log("second event");
);
```
