import type { Material3Colors } from '@/theme/material3';

/** Material 3 surface roles for containers. Use `transparent` for layout-only wrappers. */
export type AppSurface = keyof Pick<
  Material3Colors,
  | 'surface'
  | 'surfaceVariant'
  | 'surfaceContainerLow'
  | 'primaryContainer'
  | 'secondaryContainer'
  | 'tertiaryContainer'
  | 'errorContainer'
>;

export function getSurfaceBackgroundColor(
  colors: Material3Colors,
  surface: AppSurface | 'transparent',
): string | undefined {
  if (surface === 'transparent') {
    return undefined;
  }
  return colors[surface];
}

export type LegacyThemedSurface = 'background' | 'backgroundElement' | 'backgroundSelected';

export function legacySurfaceToAppSurface(type: LegacyThemedSurface): AppSurface {
  switch (type) {
    case 'backgroundElement':
      return 'surfaceContainerLow';
    case 'backgroundSelected':
      return 'secondaryContainer';
    default:
      return 'surface';
  }
}
