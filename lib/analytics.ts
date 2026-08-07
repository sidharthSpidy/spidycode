export type AnalyticsEvent = {
  id: string;
  event: string;
  detail?: string;
  path: string;
  timestamp: number;
};

const STORAGE_KEY = "spidycode-analytics-events";

function readEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function writeEvents(events: AnalyticsEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function trackEvent(event: string, detail?: string) {
  if (typeof window === "undefined") return;
  const events = readEvents();
  events.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    event,
    detail,
    path: window.location.pathname,
    timestamp: Date.now(),
  });
  writeEvents(events.slice(0, 25));
}

export function getAnalyticsSnapshot() {
  const events = readEvents();
  const totals = events.reduce<Record<string, number>>((accumulator, event) => {
    accumulator[event.event] = (accumulator[event.event] ?? 0) + 1;
    return accumulator;
  }, {});
  return {
    events,
    totals,
    total: events.length,
  };
}
