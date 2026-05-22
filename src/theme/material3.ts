import { taskflowMaterial3Dark } from '@/theme/taskflow';

/** TaskFlow uses a single dark Material 3 palette. */
export const material3Dark = taskflowMaterial3Dark;

export type Material3Colors = typeof material3Dark;

export function getMaterial3Colors(): Material3Colors {
  return material3Dark;
}

export { taskflowTypography as typography } from '@/theme/taskflow';

export { taskflowShape as shape } from '@/theme/taskflow';

export { taskflowMotion as motion } from '@/theme/taskflow';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export { statusColors, priorityColors } from '@/theme/taskflow';
