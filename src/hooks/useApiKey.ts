'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';

export function useApiKey() {
  const [apiKey, setApiKey] = useLocalStorage<string>(STORAGE_KEYS.API_KEY, '');
  return { apiKey, setApiKey };
}
