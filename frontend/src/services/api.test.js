import { describe, expect, it } from 'vitest';
import api from './api';

describe('api client', () => {
  it('uses the configured API base URL', () => {
    expect(api.defaults.baseURL).toBe(import.meta.env.VITE_API_URL || '/api/v1');
  });

  it('injects the access token into requests', async () => {
    localStorage.setItem('gymsuite_access_token', 'test-token');
    const request = await api.interceptors.request.handlers[0].fulfilled({ headers: {} });
    expect(request.headers.Authorization).toBe('Bearer test-token');
    localStorage.removeItem('gymsuite_access_token');
  });
});
