const WINDOW_SIZE = 1000

export function analyzeEvents(events) {
  const services = new Map()

  for (const event of events) {
    const stats = services.get(event.service) ?? {
      total: 0,
      errors: 0,
    }

    stats.total += 1

    if (event.type === 'error') {
      stats.errors += 1
    }

    services.set(event.service, stats)
  }

  const serviceStats = Array.from(
    services,
    ([service, stats]) => ({ service, ...stats }),
  ).sort(
    (a, b) => b.total - a.total || a.service.localeCompare(b.service),
  )

  let highestErrorService = null

  for (const stat of serviceStats) {
    if (stat.errors === 0) {
      continue
    }

    if (
      !highestErrorService ||
      stat.errors > highestErrorService.errors ||
      (stat.errors === highestErrorService.errors &&
        stat.service.localeCompare(highestErrorService.service) < 0)
    ) {
      highestErrorService = {
        service: stat.service,
        errors: stat.errors,
      }
    }
  }

  const timestamps = events
    .map((event) => event.timestamp)
    .sort((a, b) => a - b)

  let busiestWindow = null
  let left = 0

  for (let right = 0; right < timestamps.length; right += 1) {
    while (timestamps[right] - timestamps[left] >= WINDOW_SIZE) {
      left += 1
    }

    const count = right - left + 1

    if (!busiestWindow || count > busiestWindow.count) {
      busiestWindow = {
        start: timestamps[left],
        end: timestamps[left] + WINDOW_SIZE,
        count,
      }
    }
  }

  return {
    total: events.length,
    serviceStats,
    highestErrorService,
    busiestWindow,
  }
}
