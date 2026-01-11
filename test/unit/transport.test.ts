/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { buildSessionUrl, formatDateForApi, parseErrorMessage } from '../../nodes/LogRocket/transport';

describe('Transport Functions', () => {
  describe('buildSessionUrl', () => {
    it('should build a basic session URL without timestamp', () => {
      const url = buildSessionUrl('org/app', 'session-123');
      expect(url).toBe('https://app.logrocket.com/org/app/sessions/session-123');
    });

    it('should build a session URL with timestamp', () => {
      const url = buildSessionUrl('org/app', 'session-123', 5000);
      expect(url).toBe('https://app.logrocket.com/org/app/sessions/session-123?t=5000');
    });

    it('should handle zero timestamp', () => {
      const url = buildSessionUrl('org/app', 'session-123', 0);
      expect(url).toBe('https://app.logrocket.com/org/app/sessions/session-123?t=0');
    });

    it('should handle complex app IDs', () => {
      const url = buildSessionUrl('my-organization/my-application', 'abc-123-def');
      expect(url).toBe('https://app.logrocket.com/my-organization/my-application/sessions/abc-123-def');
    });
  });

  describe('formatDateForApi', () => {
    it('should format a Date object to ISO string', () => {
      const date = new Date('2024-01-15T12:30:00Z');
      const formatted = formatDateForApi(date);
      expect(formatted).toBe('2024-01-15T12:30:00.000Z');
    });

    it('should format a string date to ISO string', () => {
      const formatted = formatDateForApi('2024-01-15T12:30:00Z');
      expect(formatted).toBe('2024-01-15T12:30:00.000Z');
    });

    it('should handle date strings without timezone', () => {
      const formatted = formatDateForApi('2024-01-15');
      expect(formatted).toContain('2024-01-15');
    });
  });

  describe('parseErrorMessage', () => {
    it('should extract message from nested error object', () => {
      const error = {
        error: {
          message: 'Something went wrong',
          code: 'ERR_UNKNOWN',
        },
      };
      expect(parseErrorMessage(error)).toBe('Something went wrong');
    });

    it('should extract code when message is not present', () => {
      const error = {
        error: {
          code: 'ERR_NOT_FOUND',
        },
      };
      expect(parseErrorMessage(error)).toBe('ERR_NOT_FOUND');
    });

    it('should return direct message from flat error object', () => {
      const error = {
        message: 'Direct error message',
      };
      expect(parseErrorMessage(error)).toBe('Direct error message');
    });

    it('should return "Unknown error" for empty error objects', () => {
      expect(parseErrorMessage({})).toBe('Unknown error');
    });

    it('should handle error object with empty nested error', () => {
      const error = {
        error: {},
      };
      expect(parseErrorMessage(error)).toBe('Unknown error');
    });
  });
});
