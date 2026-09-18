# Event Analyzer

A small React application that analyzes a local event dataset and displays event counts, errors by service, and the busiest one-second period.

## Running the project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

Run the tests:

```bash
npm test
```

Build the project:

```bash
npm run build
```

## Approach

The event analysis logic is kept separate from the React UI so it can be tested independently.

Service statistics are collected with a JavaScript `Map`. The events are processed once to count the total number of events and errors for each service.

Since the input is not guaranteed to be sorted by timestamp, the timestamps are sorted before finding the busiest one-second window.

## Busiest time window

I treated the busiest time window as a rolling one-second interval rather than fixed one-second buckets.

After sorting the timestamps, I use a two-pointer sliding window to find the interval containing the most events.

The interval is treated as:

```text
[start, start + 1000)
```

This means an event exactly 1000 milliseconds after the start is not included in that window.

Sorting takes `O(n log n)` time, and the sliding-window scan takes `O(n)` time.

## Service statistics

For each service, the application tracks:

- Total events
- Error events

The service table is sorted by total event count.

If multiple services have the same highest error count, the alphabetically first service is displayed so the result is consistent.

If there are no errors, no highest-error service is shown.

## Tests

The analysis logic is tested separately from the React UI.

The tests cover:

- Event and service counts
- Unordered timestamps
- The busiest one-second window
- Empty input
- Error-related edge cases
- Time-window boundaries

## Project structure

```text
src/
├── data/
│   └── events.js
├── analysis.js
├── analysis.test.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Resources and tools used

I used the following resources while working on the assignment:

- React documentation
- Vite documentation
- MDN documentation for JavaScript `Map` and array sorting
- Node.js `node:test` documentation
- References on the sliding-window / two-pointer technique
- ChatGPT for understanding the assignment, reviewing implementation decisions, and identifying edge cases

### AI usage

One of the prompts I used was:

> "Given this React Event Analyzer take-home assignment,
help me create a project roadmap and identify the main
algorithmic decisions and edge cases."

I used ChatGPT to clarify the assignment requirements, understand concepts such as event aggregation and rolling time windows, and review parts of my implementation. I reviewed the suggestions, simplified the code, and verified the final behavior with tests.
