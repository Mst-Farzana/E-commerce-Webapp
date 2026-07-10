import { API_BASE } from './api';

export function resolveImageUrl(value) {
  if (!value) return '';

  const trimmed = String(value).trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed;
  }

  const normalized = trimmed.replace(/^\/+/, '');

  if (normalized.startsWith('uploads/')) {
    return `${API_BASE}/${normalized}`;
  }

  if (normalized.startsWith('images/')) {
    return `${API_BASE}/${normalized}`;
  }

  return `${API_BASE}/uploads/${normalized}`;
}
