export const events = [
  { timestamp: 1000, service: 'api', type: 'request' },
  { timestamp: 1100, service: 'api', type: 'request' },
  { timestamp: 1200, service: 'database', type: 'error' },
  { timestamp: 1300, service: 'api', type: 'error' },
  { timestamp: 1400, service: 'database', type: 'request' },
  { timestamp: 2100, service: 'worker', type: 'request' },
  { timestamp: 2200, service: 'api', type: 'request' },
  { timestamp: 2250, service: 'worker', type: 'error' },
  { timestamp: 3100, service: 'database', type: 'request' },
  { timestamp: 3200, service: 'api', type: 'request' },
]
