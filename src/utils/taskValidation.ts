import type { TaskDraft } from '@/domain/types/task';
import i18n from '@/i18n';

export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

export function validateTaskDraft(draft: Partial<TaskDraft>): ValidationResult {
  const errors: Record<string, string> = {};
  const title = draft.title?.trim() ?? '';

  if (!title) {
    errors.title = i18n.t('validation.titleRequired');
  } else if (title.length > 120) {
    errors.title = i18n.t('validation.titleMaxLength');
  }

  const description = draft.description?.trim();
  if (description && description.length > 500) {
    errors.description = i18n.t('validation.descriptionMaxLength');
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
