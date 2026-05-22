import i18n from '@/i18n';
import { validateTaskDraft } from '../taskValidation';

describe('validateTaskDraft', () => {
  it('rejects empty title', () => {
    const result = validateTaskDraft({ title: '  ' });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBe(i18n.t('validation.titleRequired'));
  });

  it('accepts valid draft', () => {
    const result = validateTaskDraft({
      title: 'Buy groceries',
      description: 'Milk and eggs',
      status: 'todo',
      priority: 'medium',
    });
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('rejects long title', () => {
    const result = validateTaskDraft({ title: 'a'.repeat(121) });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBe(i18n.t('validation.titleMaxLength'));
  });

  it('rejects long description', () => {
    const result = validateTaskDraft({
      title: 'Ok',
      description: 'x'.repeat(501),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.description).toBe(i18n.t('validation.descriptionMaxLength'));
  });
});
