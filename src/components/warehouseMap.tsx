
import React, { useState } from 'react';
import './warehouseMap.css';

// Types and Interfaces
export interface RackData {
  id: string;
  aisleId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  occupancy: number;
}

export interface AisleData {
  id: string;
  number: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isBlocked: boolean;
}

export interface ZoneData {
  id: string;
  name: string;
  type: 'receiving' | 'dispatch' | 'charging';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface RobotData {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'active' | 'charging' | 'idle' | 'rerouting';
  battery: number;
  targetZone: string;
  path: Array<{ x: number; y: number }>;
}

export interface warehouseMapProps {
  initialAisles?: AisleData[];
  initialRacks?: RackData[];
  initialZones?: ZoneData[];
  initialRobots?: RobotData[];
  onAisleToggle?: (aisleId: string, isBlocked: boolean) => void;
  onRobotSelect?: (robot: RobotData) => void;
  className?: string;
}

// Default warehouse zones
const DEFAULT_ZONES: ZoneData[] = [
  { id: 'z1', name: 'Receiving Dock A', type: 'receiving', x: 20, y: 30, width: 140, height: 90, color: '#00f0ff' },
  { id: 'z2', name: 'Receiving Dock B', type: 'receiving', x: 20, y: 140, width: 140, height: 90, color: '#00f0ff' },
  { id: 'z3', name: 'Dispatch Bay A', type: 'dispatch', x: 840, y: 30, width: 140, height: 90, color: '#3b82f6' },
  { id: 'z4', name: 'Dispatch Bay B', type: 'dispatch', x: 840, y: 140, width: 140, height: 90, color: '#3b82f6' },
  { id: 'z5', name: 'Fast-Charge Station 1', type: 'charging', x: 20, y: 440, width: 140, height: 110, color: '#10b981' },
  { id: 'z6', name: 'Fast-Charge Station 2', type: 'charging', x: 840, y: 440, width: 140, height: 110, color: '#10b981' },
];

// Default aisles
const DEFAULT_AISLES: AisleData[] = [
  { id: 'a1', number: 1, x: 210, y: 40, width: 110, height: 510, isBlocked: false },
  { id: 'a2', number: 2, x: 360, y: 40, width: 110, height: 510, isBlocked: false },
  { id: 'a3', number: 3, x: 510, y: 40, width: 110, height: 510, isBlocked: false },
  { id: 'a4', number: 4, x: 660, y: 40, width: 110, height: 510, isBlocked: false },
];

// Default storage racks
const DEFAULT_RACKS: RackData[] = [
  // Aisle 1
  { id: 'r1-1', aisleId: 'a1', x: 220, y: 60, width: 40, height: 200, label: 'R-101', occupancy: 85 },
  { id: 'r1-2', aisleId: 'a1', x: 270, y: 60, width: 40, height: 200, label: 'R-102', occupancy: 60 },
  { id: 'r1-3', aisleId: 'a1', x: 220, y: 320, width: 40, height: 200, label: 'R-103', occupancy: 92 },
  { id: 'r1-4', aisleId: 'a1', x: 270, y: 320, width: 40, height: 200, label: 'R-104', occupancy: 40 },

  // Aisle 2
  { id: 'r2-1', aisleId: 'a2', x: 370, y: 60, width: 40, height: 200, label: 'R-201', occupancy: 78 },
  { id: 'r2-2', aisleId: 'a2', x: 420, y: 60, width: 40, height: 200, label: 'R-202', occupancy: 50 },
  { id: 'r2-3', aisleId: 'a2', x: 370, y: 320, width: 40, height: 200, label: 'R-203', occupancy: 88 },
  { id: 'r2-4', aisleId: 'a2', x: 420, y: 320, width: 40, height: 200, label: 'R-204', occupancy: 30 },

  // Aisle 3
  { id: 'r3-1', aisleId: 'a3', x: 520, y: 60, width: 40, height: 200, label: 'R-301', occupancy: 95 },
  { id: 'r3-2', aisleId: 'a3', x: 570, y: 60, width: 40, height: 200, label: 'R-302', occupancy: 70 },
  { id: 'r3-3', aisleId: 'a3', x: 520, y: 320, width: 40, height: 200, label: 'R-303', occupancy: 65 },
  { id: 'r3-4', aisleId: 'a3', x: 570, y: 320, width: 40, height: 200, label: 'R-304', occupancy: 20 },

  // Aisle 4
  { id: 'r4-1', aisleId: 'a4', x: 670, y: 60, width: 40, height: 200, label: 'R-401', occupancy: 45 },
  { id: 'r4-2', aisleId: 'a4', x: 720, y: 60, width: 40, height: 200, label: 'R-402', occupancy: 80 },
  { id: 'r4-3', aisleId: 'a4', x: 670, y: 320, width: 40, height: 200, label: 'R-403', occupancy: 90 },
  { id: 'r4-4', aisleId: 'a4', x: 720, y: 320, width: 40, height: 200, label: 'R-404', occupancy: 15 },
];

// Default autonomous mobile robots
const DEFAULT_ROBOTS: RobotData[] = [
  {
    id: 'bot-01',
    name: 'AMR-101',
    x: 90,
    y: 75,
    status: 'active',
    battery: 88,
    targetZone: 'Dispatch Bay A',
    path: [
      { x: 90, y: 75 },
      { x: 175, y: 75 },
      { x: 175, y: 280 },
      { x: 490, y: 280 },
      { x: 820, y: 75 },
      { x: 910, y: 75 },
    ],
  },
  {
    id: 'bot-02',
    name: 'AMR-102',
    x: 342,
    y: 160,
    status: 'active',
    battery: 64,
    targetZone: 'Rack R-202',
    path: [
      { x: 90, y: 185 },
      { x: 175, y: 185 },
      { x: 342, y: 185 },
      { x: 342, y: 160 },
    ],
  },
  {
    id: 'bot-03',
    name: 'AMR-103',
    x: 90,
    y: 495,
    status: 'charging',
    battery: 22,
    targetZone: 'Fast-Charge 1',
    path: [{ x: 90, y: 495 }],
  },
  {
    id: 'bot-04',
    name: 'AMR-104',
    x: 642,
    y: 420,
    status: 'active',
    battery: 95,
    targetZone: 'Dispatch Bay B',
    path: [
      { x: 642, y: 420 },
      { x: 820, y: 420 },
      { x: 820, y: 185 },
      { x: 910, y: 185 },
    ],
  },
  {
    id: 'bot-05',
    name: 'AMR-105',
    x: 795,
    y: 280,
    status: 'rerouting',
    battery: 51,
    targetZone: 'Rack R-303',
    path: [
      { x: 910, y: 75 },
      { x: 820, y: 75 },
      { x: 795, y: 280 },
      { x: 642, y: 280 },
      { x: 642, y: 380 },
    ],
  },
  {
    id: 'bot-06',
    name: 'AMR-106',
    x: 910,
    y: 495,
    status: 'idle',
    battery: 100,
    targetZone: 'Standby Zone',
    path: [{ x: 910, y: 495 }],
  },
];

export const warehouseMap: React.FC<warehouseMapProps> = ({
  initialAisles = DEFAULT_AISLES,
  initialRacks = DEFAULT_RACKS,
  initialZones = DEFAULT_ZONES,
  initialRobots = DEFAULT_ROBOTS,
  onAisleToggle,
  onRobotSelect,
  className = '',
}) => {
  const [aisles, setAisles] = useState<AisleData[]>(initialAisles);
  const [selectedAisle, setSelectedAisle] = useState<string | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  // Toggle an aisle between blocked and open.
  const toggleAisleBlock = (id: string) => {
    setAisles((previousAisles) =>
      previousAisles.map((aisle) => {
        if (aisle.id !== id) {
          return aisle;
        }

        const nextState = !aisle.isBlocked;
        onAisleToggle?.(id, nextState);

        return { ...aisle, isBlocked: nextState };
      }),
    );
  };

  // Restore all aisles to their original unblocked state.
  const resetLayout = () => {
    setAisles(
      initialAisles.map((aisle) => ({
        ...aisle,
        isBlocked: false,
      })),
    );

    aisles.forEach((aisle) => {
      if (aisle.isBlocked) {
        onAisleToggle?.(aisle.id, false);
      }
    });

    setSelectedAisle(null);
    setHoveredEntity(null);
  };

  const pointsToPathD = (
    points: Array<{ x: number; y: number }>,
  ): string => {
    if (!points || points.length === 0) {
      return '';
    }

    return points.reduce(
      (path, point, index) =>
        `${path} ${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
      '',
    );
  };

  return (
    <div className={`ripplesim-map-container ${className}`}>
      {/* Header controls and status */}
      <div className="map-toolbar">
        <div className="map-title-group">
          <span className="live-indicator" />
          <h3 className="map-heading">RIPPLESIM MAP VIEW</h3>
          <span className="map-subtitle">2D DIGITAL TWIN OVERVIEW</span>

          {hoveredEntity && (
            <span className="map-subtitle" aria-live="polite">
              Hovering: {hoveredEntity}
            </span>
          )}
        </div>

        <div className="map-actions">
          <button
            type="button"
            className="reset-btn"
            onClick={resetLayout}
            title="Restore default layout"
          >
            Reset Aisles
          </button>
        </div>
      </div>

      {/* Main warehouse map */}
      <div className="map-canvas-wrapper">
        <svg
          viewBox="0 0 1000 600"
          className="warehouse-svg"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Interactive 2D warehouse digital twin map"
        >
          <defs>
            {/* Dark grid background */}
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(0, 240, 255, 0.05)"
                strokeWidth="1"
              />
            </pattern>

            {/* Blocked aisle hazard pattern */}
            <pattern
              id="hazard-pattern"
              width="20"
              height="20"
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="10"
                height="20"
                fill="rgba(239, 68, 68, 0.35)"
              />
              <rect
                x="10"
                width="10"
                height="20"
                fill="rgba(30, 10, 15, 0.85)"
              />
            </pattern>

            {/* Cyan route glow */}
            <filter
              id="cyan-glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite
                in="SourceGraphic"
                in2="blur"
                operator="over"
              />
            </filter>
          </defs>

          {/* Canvas background */}
          <rect width="1000" height="600" fill="#090d16" />
          <rect width="1000" height="600" fill="url(#grid)" />

          {/* Outer warehouse wall */}
          <rect
            x="10"
            y="10"
            width="980"
            height="580"
            fill="none"
            stroke="#1e293b"
            strokeWidth="3"
            rx="4"
          />

          {/* Operational zones */}
          {initialZones.map((zone) => (
            <g key={zone.id} className="zone-group">
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                fill={`${zone.color}0d`}
                stroke={zone.color}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                rx="6"
              />

              <text
                x={zone.x + 10}
                y={zone.y + 22}
                fill={zone.color}
                fontSize="11"
                fontWeight="600"
                letterSpacing="0.5"
              >
                {zone.name.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Robot travel routes */}
          {initialRobots.map((robot) => {
            if (robot.path.length < 2) {
              return null;
            }

            const pathData = pointsToPathD(robot.path);
            const isRerouting = robot.status === 'rerouting';
            const strokeColor = isRerouting ? '#f59e0b' : '#00f0ff';

            return (
              <g key={`path-${robot.id}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="3"
                  strokeOpacity="0.3"
                  filter="url(#cyan-glow)"
                />

                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  className="animated-route"
                />
              </g>
            );
          })}

          {/* Clickable aisles */}
          {aisles.map((aisle) => (
            <g
              key={aisle.id}
              className={`aisle-group ${
                aisle.isBlocked ? 'blocked' : 'clear'
              } ${selectedAisle === aisle.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedAisle(aisle.id);
                toggleAisleBlock(aisle.id);
              }}
              onMouseEnter={() =>
                setHoveredEntity(`Aisle ${aisle.number}`)
              }
              onMouseLeave={() => setHoveredEntity(null)}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              aria-label={`Aisle ${aisle.number}, ${
                aisle.isBlocked ? 'blocked' : 'open'
              }. Click to toggle.`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedAisle(aisle.id);
                  toggleAisleBlock(aisle.id);
                }
              }}
            >
              {/* Main aisle region */}
              <rect
                x={aisle.x}
                y={aisle.y}
                width={aisle.width}
                height={aisle.height}
                fill={
                  aisle.isBlocked
                    ? 'url(#hazard-pattern)'
                    : 'rgba(15, 23, 42, 0.4)'
                }
                stroke={
                  aisle.isBlocked
                    ? '#ef4444'
                    : selectedAisle === aisle.id
                      ? '#00f0ff'
                      : 'rgba(51, 65, 85, 0.5)'
                }
                strokeWidth={
                  aisle.isBlocked || selectedAisle === aisle.id ? '2' : '1'
                }
                rx="4"
              />

              {/* Aisle label */}
              <rect
                x={aisle.x + aisle.width / 2 - 28}
                y={aisle.y + 10}
                width="56"
                height="20"
                fill={aisle.isBlocked ? '#ef4444' : '#1e293b'}
                rx="3"
              />

              <text
                x={aisle.x + aisle.width / 2}
                y={aisle.y + 24}
                textAnchor="middle"
                fill={aisle.isBlocked ? '#ffffff' : '#94a3b8'}
                fontSize="10"
                fontWeight="700"
                pointerEvents="none"
              >
                {aisle.isBlocked
                  ? 'BLOCKED'
                  : `AISLE ${aisle.number}`}
              </text>
            </g>
          ))}

          {/* Storage racks */}
          {initialRacks.map((rack) => (
            <g key={rack.id} className="rack-group">
              <rect
                x={rack.x}
                y={rack.y}
                width={rack.width}
                height={rack.height}
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1.5"
                rx="2"
              />

              {/* Rack occupancy indicator */}
              <rect
                x={rack.x + 2}
                y={
                  rack.y +
                  rack.height -
                  (rack.height * rack.occupancy) / 100
                }
                width={rack.width - 4}
                height={(rack.height * rack.occupancy) / 100 - 2}
                fill="rgba(0, 240, 255, 0.25)"
                rx="1"
              />

              <text
                x={rack.x + rack.width / 2}
                y={rack.y + rack.height / 2}
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
                fontWeight="600"
                transform={`rotate(-90 ${
                  rack.x + rack.width / 2
                } ${rack.y + rack.height / 2})`}
              >
                {rack.label}
              </text>
            </g>
          ))}

          {/* Autonomous mobile robots */}
          {initialRobots.map((robot) => (
            <g
              key={robot.id}
              className="robot-node"
              transform={`translate(${robot.x}, ${robot.y})`}
              onClick={() => onRobotSelect?.(robot)}
              onMouseEnter={() => setHoveredEntity(robot.name)}
              onMouseLeave={() => setHoveredEntity(null)}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              aria-label={`${robot.name}, status ${robot.status}, battery ${robot.battery}%`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onRobotSelect?.(robot);
                }
              }}
            >
              {/* Radar pulse for active or rerouting robots */}
              {(robot.status === 'active' ||
                robot.status === 'rerouting') && (
                <circle
                  r="16"
                  fill="none"
                  stroke={
                    robot.status === 'rerouting' ? '#f59e0b' : '#00f0ff'
                  }
                  strokeWidth="1"
                  className="robot-pulse"
                />
              )}

              {/* Robot body */}
              <circle
                r="11"
                fill="#0f172a"
                stroke={
                  robot.status === 'active'
                    ? '#00f0ff'
                    : robot.status === 'charging'
                      ? '#10b981'
                      : robot.status === 'rerouting'
                        ? '#f59e0b'
                        : '#64748b'
                }
                strokeWidth="2.5"
              />

              {/* Robot center */}
              <circle
                r="4"
                fill={
                  robot.status === 'charging'
                    ? '#10b981'
                    : robot.status === 'rerouting'
                      ? '#f59e0b'
                      : '#00f0ff'
                }
              />

              {/* Robot label */}
              <rect
                x="-20"
                y="-24"
                width="40"
                height="12"
                fill="rgba(15, 23, 42, 0.85)"
                rx="2"
                stroke="#334155"
                strokeWidth="0.5"
              />

              <text
                x="0"
                y="-15"
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="8"
                fontWeight="700"
                pointerEvents="none"
              >
                {robot.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Map legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-swatch rack-swatch" />
          <span>Storage Rack</span>
        </div>

        <div className="legend-item">
          <span className="legend-swatch robot-swatch" />
          <span>AMR Robot</span>
        </div>

        <div className="legend-item">
          <span className="legend-swatch route-swatch" />
          <span>Active Route</span>
        </div>

        <div className="legend-item">
          <span className="legend-swatch blocked-swatch" />
          <span>Blocked Aisle (Click to Toggle)</span>
        </div>

        <div className="legend-item">
          <span className="legend-swatch charging-swatch" />
          <span>Charging Hub</span>
        </div>
      </div>
    </div>
  );
};

export default warehouseMap;
