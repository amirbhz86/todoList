import { getSurfaceBackgroundColor, legacySurfaceToAppSurface } from '@/utils/appView';
import { material3Dark } from '@/theme/material3';

describe('AppView utilities', () => {
  it('returns undefined for transparent surface', () => {
    expect(getSurfaceBackgroundColor(material3Dark, 'transparent')).toBeUndefined();
  });

  it('returns Material 3 color for named surface', () => {
    expect(getSurfaceBackgroundColor(material3Dark, 'surfaceVariant')).toBe(
      material3Dark.surfaceVariant,
    );
  });

  it('maps legacy themed surfaces', () => {
    expect(legacySurfaceToAppSurface('background')).toBe('surface');
    expect(legacySurfaceToAppSurface('backgroundElement')).toBe('surfaceContainerLow');
    expect(legacySurfaceToAppSurface('backgroundSelected')).toBe('secondaryContainer');
  });
});
