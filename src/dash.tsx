import { useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import WarehouseMap, { type RobotData } from './components/warehouseMap'
import './dash.css'

/* ---------- Icons (inline SVG, no external dependency) ---------- */

type IconName =
  | 'overview' | 'twin' | 'simulations' | 'ripple' | 'log' | 'pulse' | 'settings'
  | 'menu' | 'close' | 'bell' | 'robot' | 'tasks' | 'clock' | 'shield'
  | 'warehouse' | 'alert' | 'info' | 'play'

const ICON_PATHS: Record<IconName, ReactNode> = {
  overview: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
  twin: <><path d="M21 8 12 3 3 8v8l9 5 9-5Z" /><path d="m3.3 7.5 8.7 5 8.7-5" /><path d="M12 22V12.5" /></>,
  simulations: <><circle cx="12" cy="12" r="10" /><path d="m10 8 6 4-6 4Z" /></>,
  ripple: <><circle cx="12" cy="12" r="2" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="10" /></>,
  log: <><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></>,
  pulse: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  settings: <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
  robot: <><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M12 8V4M2 14h2M20 14h2M9 14v.01M15 14v.01" /></>,
  tasks: <><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  shield: <><path d="M20 13c0 5-3.5 7.5-7.7 8.97a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>,
  warehouse: <><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35a2 2 0 0 1 1.18-1.85l8-3.6a2 2 0 0 1 1.64 0l8 3.6A2 2 0 0 1 22 8.35Z" /><path d="M6 18h12M6 14h12M6 22v-8M18 22v-8" /></>,
  alert: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4M12 17h.01" /></>,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
  play: <path d="m6 3 14 9-14 9Z" />,
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="ripple-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

function LogoMark() {
  return (
    <svg className="ripple-logo" width="34" height="34" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="#172230" stroke="rgba(137,152,170,0.28)" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#48D9E8" strokeOpacity="0.3" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="6.5" fill="none" stroke="#48D9E8" strokeOpacity="0.65" strokeWidth="1.2" />
      <path d="M16 16 24.5 10.5M16 16 8.5 22" stroke="#709CFF" strokeOpacity="0.7" strokeWidth="1" />
      <circle cx="16" cy="16" r="2.6" fill="#48D9E8" />
      <circle cx="24.5" cy="10.5" r="1.8" fill="#709CFF" />
      <circle cx="8.5" cy="22" r="1.8" fill="#709CFF" />
    </svg>
  )
}

/* ---------- Typed data ---------- */

type NavItem = { id: string; label: string; icon: IconName }

const PRIMARY_NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: 'overview' },
  { id: 'digital-twin', label: 'Digital Twin', icon: 'twin' },
  { id: 'simulations', label: 'Simulations', icon: 'simulations' },
  { id: 'ripple-analysis', label: 'Ripple Analysis', icon: 'ripple' },
  { id: 'activity-log', label: 'Activity Log', icon: 'log' },
]

const SECONDARY_NAV: NavItem[] = [
  { id: 'system-status', label: 'System Status', icon: 'pulse' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

type Tone = 'neutral' | 'accent' | 'info' | 'success'

type Metric = {
  id: string
  label: string
  value: string
  caption: string
  icon: IconName
  tone: Tone
  statusDot?: boolean
}

const METRICS: Metric[] = [
  { id: 'robots', label: 'Active Robots', value: '6 / 6', caption: 'AMR fleet online', icon: 'robot', tone: 'neutral', statusDot: true },
  { id: 'tasks', label: 'Active Tasks', value: '38', caption: 'Across all warehouse zones', icon: 'tasks', tone: 'accent' },
  { id: 'time', label: 'Average Task Time', value: '4.8 min', caption: 'Sample processing time', icon: 'clock', tone: 'info' },
  { id: 'health', label: 'System Health', value: '96.4%', caption: 'Demo health score', icon: 'shield', tone: 'success' },
]

type Severity = 'warning' | 'notice' | 'idle'

type Insight = { id: string; title: string; text: string; icon: IconName; severity: Severity; severityLabel: string }

const INSIGHTS: Insight[] = [
  { id: 'congestion', title: 'Aisle congestion', text: 'Click any aisle on the map to block traffic and test rerouting.', icon: 'alert', severity: 'warning', severityLabel: 'Interactive' },
  { id: 'availability', title: 'Robot telemetry', text: 'Select any AMR on the map to inspect battery and status.', icon: 'robot', severity: 'notice', severityLabel: 'Live' },
  { id: 'status', title: 'Simulation engine', text: 'Digital Twin layout active and synchronized.', icon: 'info', severity: 'idle', severityLabel: 'Nominal' },
]

/* ---------- Sidebar ---------- */

type SidebarProps = {
  activeId: string
  isOpen: boolean
  onSelect: (id: string) => void
  onClose: () => void
  closeRef: RefObject<HTMLButtonElement | null>
}

function NavList({ items, label, activeId, onSelect }: { items: NavItem[]; label: string; activeId: string; onSelect: (id: string) => void }) {
  return (
    <nav aria-label={label}>
      <ul className="ripple-nav__list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="ripple-nav__item"
              aria-current={item.id === activeId ? 'page' : undefined}
              onClick={() => onSelect(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Sidebar({ activeId, isOpen, onSelect, onClose, closeRef }: SidebarProps) {
  return (
    <aside id="ripple-sidebar" className={`ripple-sidebar${isOpen ? ' is-open' : ''}`}>
      <div className="ripple-brand">
        <LogoMark />
        <div className="ripple-brand__text">
          <span className="ripple-brand__name">RippleSim</span>
          <span className="ripple-brand__tag">WAREHOUSE INTELLIGENCE</span>
        </div>
        <button ref={closeRef} type="button" className="ripple-icon-btn ripple-sidebar__close" aria-label="Close navigation menu" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>

      <NavList items={PRIMARY_NAV} label="Primary" activeId={activeId} onSelect={onSelect} />
      <hr className="ripple-divider" />
      <NavList items={SECONDARY_NAV} label="Secondary" activeId={activeId} onSelect={onSelect} />

      <div className="ripple-sidebar__status" role="status">
        <span className="ripple-dot ripple-dot--success" aria-hidden="true" />
        <div>
          <p className="ripple-sidebar__status-title">Simulation Engine</p>
          <p className="ripple-sidebar__status-value">Ready</p>
        </div>
      </div>
    </aside>
  )
}

/* ---------- Header ---------- */

function WorkspaceHeader({ menuOpen, onMenuToggle, menuRef }: { menuOpen: boolean; onMenuToggle: () => void; menuRef: RefObject<HTMLButtonElement | null> }) {
  return (
    <header className="ripple-header">
      <button
        ref={menuRef}
        type="button"
        className="ripple-icon-btn ripple-header__menu"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="ripple-sidebar"
        onClick={onMenuToggle}
      >
        <Icon name={menuOpen ? 'close' : 'menu'} />
      </button>

      <div className="ripple-header__titles">
        <p className="ripple-breadcrumb">Workspace / Digital Twin</p>
        <h1 className="ripple-h1">Warehouse Digital Twin</h1>
        <p className="ripple-header__desc">Monitor live AMR routes, toggle aisle blockages, and analyze dynamic simulation pathways.</p>
      </div>

      <div className="ripple-header__actions">
        <span className="ripple-env">
          <span className="ripple-dot ripple-dot--warning" aria-hidden="true" />
          DEMO ENVIRONMENT
        </span>
        <button type="button" className="ripple-icon-btn" aria-label="View notifications">
          <Icon name="bell" />
        </button>
        <span className="ripple-avatar" role="img" aria-label="User avatar, initials AR">AR</span>
      </div>
    </header>
  )
}

/* ---------- Content blocks ---------- */

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className={`ripple-card ripple-tone--${metric.tone}`}>
      <div className="ripple-card__top">
        <span className="ripple-card__icon"><Icon name={metric.icon} /></span>
        <h3 className="ripple-card__label">{metric.label}</h3>
        {metric.statusDot && <span className="ripple-dot ripple-dot--success ripple-card__dot" role="img" aria-label="Sample status: normal" />}
      </div>
      <p className="ripple-card__value">{metric.value}</p>
      <p className="ripple-card__caption">{metric.caption}</p>
    </article>
  )
}

function WarehouseDigitalTwin({
  selectedRobot,
  onAisleToggle,
  onRobotSelect
}: {
  selectedRobot: RobotData | null
  onAisleToggle: (aisleId: string, isBlocked: boolean) => void
  onRobotSelect: (robot: RobotData) => void
}) {
  return (
    <section className="ripple-panel ripple-twin" aria-labelledby="ripple-twin-title" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="ripple-panel__head" style={{ marginBottom: 0 }}>
        <div>
          <h3 id="ripple-twin-title" className="ripple-panel__title">Interactive 2D Warehouse Map</h3>
          <p className="ripple-panel__desc">Click aisles to simulate blockages or click AMRs for live telemetry inspection.</p>
        </div>
      </div>
      
      {/* Embedded WarehouseMap Component */}
      <WarehouseMap
        onAisleToggle={onAisleToggle}
        onRobotSelect={onRobotSelect}
      />

      {/* Selected Robot Inspector Card (if active) */}
      {selectedRobot && (
        <div style={{ background: '#050811', border: '1px solid #1e293b', borderRadius: '6px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: '700', letterSpacing: '0.5px' }}>AMR INSPECTOR ACTIVE</span>
            <h4 style={{ margin: '2px 0 0 0', fontSize: '14px', color: '#f8fafc' }}>{selectedRobot.name} — Target: {selectedRobot.targetZone}</h4>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8' }}>
            <div>Status: <strong style={{ color: '#00f0ff' }}>{selectedRobot.status.toUpperCase()}</strong></div>
            <div>Battery: <strong style={{ color: '#10b981' }}>{selectedRobot.battery}%</strong></div>
            <div>Coords: <strong style={{ color: '#f8fafc' }}>({selectedRobot.x}, {selectedRobot.y})</strong></div>
          </div>
        </div>
      )}
    </section>
  )
}

function RippleInsights() {
  return (
    <section className="ripple-panel ripple-insights" aria-labelledby="ripple-insights-title">
      <div className="ripple-panel__head">
        <div>
          <h3 id="ripple-insights-title" className="ripple-panel__title">Ripple Insights</h3>
          <p className="ripple-panel__desc">Live telemetry and disruption heuristics.</p>
        </div>
      </div>
      <ul className="ripple-insights__list">
        {INSIGHTS.map((item) => (
          <li key={item.id} className={`ripple-insight ripple-insight--${item.severity}`}>
            <span className="ripple-insight__icon"><Icon name={item.icon} size={16} /></span>
            <div className="ripple-insight__body">
              <div className="ripple-insight__row">
                <h4 className="ripple-insight__title">{item.title}</h4>
                <span className="ripple-insight__sev">{item.severityLabel}</span>
              </div>
              <p className="ripple-insight__text">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="ripple-insights__action">
        <button type="button" className="ripple-btn" aria-describedby="ripple-sim-note">
          <Icon name="play" size={14} />
          Run Simulation
        </button>
        <p id="ripple-sim-note" className="ripple-insights__note">Dynamic pathfinder engine ready</p>
      </div>
    </section>
  )
}

/* ---------- Root ---------- */

export default function Dashboard() {
  const [activeId, setActiveId] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedRobot, setSelectedRobot] = useState<RobotData | null>(null)
  const [systemLog, setSystemLog] = useState<string>('System nominal.')

  const menuRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const handleSelect = (id: string) => {
    setActiveId(id)
    setMenuOpen(false)
  }

  const handleAisleToggle = (aisleId: string, isBlocked: boolean) => {
    setSystemLog(`Aisle ${aisleId.toUpperCase()} marked as ${isBlocked ? 'BLOCKED - Rerouting AMRs' : 'CLEAR'}`)
  }

  const handleRobotSelect = (robot: RobotData) => {
    setSelectedRobot(robot)
    setSystemLog(`Inspecting AMR: ${robot.name}`)
  }

  return (
    <div className="ripple-app">
      <Sidebar activeId={activeId} isOpen={menuOpen} onSelect={handleSelect} onClose={() => setMenuOpen(false)} closeRef={closeRef} />
      {menuOpen && <div className="ripple-scrim" aria-hidden="true" onClick={() => setMenuOpen(false)} />}

      <div className="ripple-main">
        <WorkspaceHeader menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((o) => !o)} menuRef={menuRef} />

        <main className="ripple-content">
          <section aria-labelledby="ripple-overview-title">
            <div className="ripple-section__head">
              <div>
                <h2 id="ripple-overview-title" className="ripple-h2">Operational Overview</h2>
                <p className="ripple-eyebrow">WAREHOUSE DIGITAL TWIN · LIVE VIEW</p>
              </div>
              <span className="ripple-chip">Status: {systemLog}</span>
            </div>
            <div className="ripple-kpis">
              {METRICS.map((m) => <MetricCard key={m.id} metric={m} />)}
            </div>
          </section>

          <div className="ripple-workspace">
            <WarehouseDigitalTwin
              selectedRobot={selectedRobot}
              onAisleToggle={handleAisleToggle}
              onRobotSelect={handleRobotSelect}
            />
            <RippleInsights />
          </div>
        </main>
      </div>
    </div>
  )
}