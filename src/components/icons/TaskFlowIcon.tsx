import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import {
  BOARD_RECTS,
  TASKFLOW_ICONS,
  TASKS_RECTS,
  type TaskFlowIconName,
} from '@/components/icons/icons';

export type { TaskFlowIconName };

type TaskFlowIconProps = {
  name: TaskFlowIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function TaskFlowIcon({
  name,
  size = 24,
  color = '#9898a8',
  strokeWidth = 2,
}: TaskFlowIconProps) {
  const def = TASKFLOW_ICONS[name];
  const viewBox = def.viewBox ?? '0 0 24 24';

  if (name === 'board') {
    return (
      <Svg width={size} height={size} viewBox={viewBox} fill="none">
        {BOARD_RECTS.map((r) => (
          <Rect
            key={`${r.x}-${r.y}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            rx={r.rx}
            stroke={color}
            strokeWidth={strokeWidth * 0.9}
          />
        ))}
      </Svg>
    );
  }

  if (name === 'tasks' || name === 'calendar') {
    return (
      <Svg width={size} height={size} viewBox={viewBox} fill="none">
        {TASKS_RECTS.map((r) => (
          <Rect
            key={`${r.x}-${r.y}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            rx={r.rx}
            stroke={color}
            strokeWidth={strokeWidth * 0.9}
          />
        ))}
        {def.paths.map((d, i) => (
          <Path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox={viewBox} fill="none">
      {def.circles?.map((c, i) => (
        <Circle
          key={`c-${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      ))}
      {def.paths.map((d, i) => (
        <Path
          key={`p-${i}`}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={def.fill ? color : 'none'}
        />
      ))}
    </Svg>
  );
}
