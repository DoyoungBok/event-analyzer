import test from 'node:test'
import assert from 'node:assert/strict'

import { analyzeEvents } from './analysis.js'

test('summarizes events by service', () => {
  const result = analyzeEvents([
    { timestamp: 1300, service: 'api', type: 'error' },
    { timestamp: 1000, service: 'api', type: 'request' },
    { timestamp: 1200, service: 'database', type: 'error' },
    { timestamp: 1400, service: 'database', type: 'request' },
  ])

  assert.equal(result.total, 4)

  assert.deepEqual(result.serviceStats, [
    { service: 'api', total: 2, errors: 1 },
    { service: 'database', total: 2, errors: 1 },
  ])

  assert.deepEqual(result.highestErrorService, {
    service: 'api',
    errors: 1,
  })
})

test('finds the busiest one-second window', () => {
  const result = analyzeEvents([
    { timestamp: 2500, service: 'api', type: 'request' },
    { timestamp: 1000, service: 'api', type: 'request' },
    { timestamp: 1800, service: 'api', type: 'error' },
  ])

  assert.deepEqual(result.busiestWindow, {
    start: 1000,
    end: 2000,
    count: 2,
  })
})

test('handles empty input', () => {
  const result = analyzeEvents([])

  assert.equal(result.total, 0)
  assert.deepEqual(result.serviceStats, [])
  assert.equal(result.highestErrorService, null)
  assert.equal(result.busiestWindow, null)
})

test('returns no highest-error service when there are no errors', () => {
  const result = analyzeEvents([
    { timestamp: 1000, service: 'api', type: 'request' },
    { timestamp: 1200, service: 'database', type: 'request' },
  ])

  assert.equal(result.highestErrorService, null)
})

test('excludes events at the end of the one-second window', () => {
  const result = analyzeEvents([
    { timestamp: 1000, service: 'api', type: 'request' },
    { timestamp: 1999, service: 'api', type: 'request' },
    { timestamp: 2000, service: 'api', type: 'request' },
  ])

  assert.equal(result.busiestWindow.count, 2)
})
