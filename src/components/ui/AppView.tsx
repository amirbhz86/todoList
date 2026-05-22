import React, { useMemo } from 'react';
import { View, type ViewProps } from 'react-native';

import { useMaterialTheme } from '@/theme/ThemeProvider';
import {
  getSurfaceBackgroundColor,
  type AppSurface,
} from '@/utils/appView';

export type { AppSurface, LegacyThemedSurface } from '@/utils/appView';
export { getSurfaceBackgroundColor, legacySurfaceToAppSurface } from '@/utils/appView';

export type AppViewProps = ViewProps & {
  surface?: AppSurface | 'transparent';
};

export function AppView({ surface = 'transparent', style, ...rest }: AppViewProps) {
  const { colors } = useMaterialTheme();

  const backgroundStyle = useMemo(() => {
    const backgroundColor = getSurfaceBackgroundColor(colors, surface);
    return backgroundColor ? { backgroundColor } : null;
  }, [colors, surface]);

  return <View style={[backgroundStyle, style]} {...rest} />;
}
