import { events } from './data/events.js'
import { analyzeEvents } from './analysis.js'
import './App.css'

const analysis = analyzeEvents(events)

function formatTimestamp(timestamp) {
  return `${(timestamp / 1000).toFixed(2)}s`
}

function SummaryCard({ label, value, detail }) {
  return (
    <div className="summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  )
}

function App() {
  const {
    total,
    serviceStats,
    highestErrorService,
    busiestWindow,
  } = analysis

  return (
    <main className="app">
      <header className="header">
        <h1>Event Analyzer</h1>
        <p>Summary of event activity by service and time window.</p>
      </header>

      <section className="summary-grid">
        <SummaryCard
          label="Total events"
          value={total}
        />

        <SummaryCard
          label="Services"
          value={serviceStats.length}
        />

        <SummaryCard
          label="Most errors"
          value={highestErrorService?.service ?? 'None'}
          detail={
            highestErrorService
              ? `${highestErrorService.errors} error${
                  highestErrorService.errors === 1 ? '' : 's'
                }`
              : 'No errors'
          }
        />

        <SummaryCard
          label="Busiest window"
          value={
            busiestWindow
              ? `${busiestWindow.count} events`
              : 'None'
          }
          detail={
            busiestWindow
              ? `${formatTimestamp(busiestWindow.start)} – ${formatTimestamp(
                  busiestWindow.end,
                )}`
              : 'No events'
          }
        />
      </section>

      <section className="panel">
        <h2>Events by service</h2>

        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Events</th>
              <th>Errors</th>
            </tr>
          </thead>

          <tbody>
            {serviceStats.map((stat) => (
              <tr key={stat.service}>
                <td>{stat.service}</td>
                <td>{stat.total}</td>
                <td>{stat.errors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default App
