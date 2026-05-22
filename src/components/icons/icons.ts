/** SVG path data from taskflow-mobile.html (stroke icons, 24×24 viewBox). */
export type TaskFlowIconName =
  | 'search'
  | 'filter'
  | 'plus'
  | 'close'
  | 'tasks'
  | 'board'
  | 'stats'
  | 'check'
  | 'edit'
  | 'delete'
  | 'clock'
  | 'refresh'
  | 'calendar'
  | 'settings';

type IconDef = {
  viewBox?: string;
  paths: string[];
  circles?: { cx: number; cy: number; r: number }[];
  fill?: boolean;
};

export const TASKFLOW_ICONS: Record<TaskFlowIconName, IconDef> = {
  search: {
    paths: ['M21 21l-4.35-4.35'],
    circles: [{ cx: 11, cy: 11, r: 8 }],
  },
  filter: {
    paths: ['M4 6h16', 'M8 12h8', 'M11 18h2'],
  },
  plus: {
    paths: ['M12 5v14', 'M5 12h14'],
  },
  close: {
    paths: ['M18 6 6 18', 'M6 6l12 12'],
  },
  tasks: {
    paths: ['M3 10h18', 'M8 3v4', 'M16 3v4'],
    fill: true,
    viewBox: '0 0 24 24',
  },
  board: {
    paths: [],
    fill: true,
    viewBox: '0 0 24 24',
  },
  stats: {
    paths: ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
  },
  check: {
    paths: ['m5 12 5 5L20 7', 'm9 12 2 2 4-4'],
    circles: [{ cx: 12, cy: 12, r: 9 }],
  },
  edit: {
    paths: ['M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z'],
  },
  delete: {
    paths: [
      'M3 6h18',
      'M19 6l-1 14H6L5 6',
      'M10 11v6',
      'M14 11v6',
      'M9 6V4h6v2',
    ],
  },
  clock: {
    paths: ['M12 7v5l3 3'],
    circles: [{ cx: 12, cy: 12, r: 9 }],
  },
  refresh: {
    paths: ['M3 12a9 9 0 1 1 4.5 7.8', 'M3 8v4h4'],
  },
  calendar: {
    paths: ['M3 10h18', 'M8 3v4', 'M16 3v4'],
    fill: true,
  },
  settings: {
    paths: [
      'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
      'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z',
    ],
  },
};

// Board icon uses rects — custom render in TaskFlowIcon
export const BOARD_RECTS = [
  { x: 3, y: 3, w: 7, h: 18, rx: 1 },
  { x: 14, y: 3, w: 7, h: 11, rx: 1 },
];

// Tasks/calendar filled rects
export const TASKS_RECTS = [{ x: 3, y: 5, w: 18, h: 16, rx: 2 }];
