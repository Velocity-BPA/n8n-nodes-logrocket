/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  simplifySession,
  simplifyUser,
  simplifyIssue,
  simplifyError,
  simplifyEvent,
  simplifyMetric,
  toIsoString,
  buildSessionQuery,
  validateRequired,
} from '../../nodes/LogRocket/utils/helpers';

describe('Helper Functions', () => {
  describe('simplifySession', () => {
    it('should simplify session data with snake_case fields', () => {
      const session = {
        id: 'session-123',
        user_id: 'user-456',
        email: 'test@example.com',
        start_time: '2024-01-15T10:00:00Z',
        end_time: '2024-01-15T10:30:00Z',
        duration: 1800,
        browser: 'Chrome',
        os: 'Windows',
        device: 'Desktop',
        url: 'https://example.com',
        has_error: true,
        error_count: 3,
        page_count: 5,
      };

      const result = simplifySession(session, 'org/app');

      expect(result).toEqual({
        id: 'session-123',
        userId: 'user-456',
        email: 'test@example.com',
        sessionUrl: 'https://app.logrocket.com/org/app/sessions/session-123',
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T10:30:00Z',
        duration: 1800,
        browser: 'Chrome',
        os: 'Windows',
        device: 'Desktop',
        url: 'https://example.com',
        hasError: true,
        errorCount: 3,
        pageCount: 5,
      });
    });

    it('should handle camelCase fields', () => {
      const session = {
        id: 'session-123',
        userId: 'user-456',
        startTime: '2024-01-15T10:00:00Z',
        hasError: false,
        errorCount: 0,
      };

      const result = simplifySession(session, 'org/app');

      expect(result.userId).toBe('user-456');
      expect(result.startTime).toBe('2024-01-15T10:00:00Z');
      expect(result.hasError).toBe(false);
    });
  });

  describe('simplifyUser', () => {
    it('should simplify user data', () => {
      const user = {
        id: 'internal-123',
        user_id: 'user-456',
        email: 'test@example.com',
        name: 'John Doe',
        traits: { plan: 'premium' },
        first_seen: '2024-01-01T00:00:00Z',
        last_seen: '2024-01-15T10:00:00Z',
        session_count: 42,
      };

      const result = simplifyUser(user);

      expect(result).toEqual({
        id: 'internal-123',
        userId: 'user-456',
        email: 'test@example.com',
        name: 'John Doe',
        traits: { plan: 'premium' },
        firstSeen: '2024-01-01T00:00:00Z',
        lastSeen: '2024-01-15T10:00:00Z',
        sessionCount: 42,
      });
    });
  });

  describe('simplifyIssue', () => {
    it('should simplify issue data', () => {
      const issue = {
        id: 'issue-123',
        type: 'error',
        status: 'open',
        severity: 'high',
        title: 'TypeError in component',
        message: 'Cannot read property x of undefined',
        first_occurrence: '2024-01-10T00:00:00Z',
        last_occurrence: '2024-01-15T10:00:00Z',
        occurrence_count: 150,
        affected_users: 25,
        assignee: 'john@example.com',
      };

      const result = simplifyIssue(issue);

      expect(result.type).toBe('error');
      expect(result.severity).toBe('high');
      expect(result.occurrenceCount).toBe(150);
      expect(result.affectedUsers).toBe(25);
    });
  });

  describe('simplifyError', () => {
    it('should simplify error data', () => {
      const error = {
        id: 'error-123',
        message: 'TypeError: Cannot read property',
        type: 'TypeError',
        url: 'https://example.com/app',
        browser: 'Chrome',
        os: 'MacOS',
        first_occurrence: '2024-01-10T00:00:00Z',
        last_occurrence: '2024-01-15T10:00:00Z',
        occurrence_count: 50,
        affected_users: 10,
        resolved: false,
      };

      const result = simplifyError(error);

      expect(result.type).toBe('TypeError');
      expect(result.occurrenceCount).toBe(50);
      expect(result.resolved).toBe(false);
    });
  });

  describe('simplifyEvent', () => {
    it('should simplify event data', () => {
      const event = {
        id: 'event-123',
        name: 'button_click',
        type: 'track',
        timestamp: '2024-01-15T10:00:00Z',
        properties: { button_id: 'submit' },
        user_id: 'user-456',
        session_id: 'session-789',
      };

      const result = simplifyEvent(event);

      expect(result.name).toBe('button_click');
      expect(result.type).toBe('track');
      expect(result.userId).toBe('user-456');
      expect(result.sessionId).toBe('session-789');
    });
  });

  describe('simplifyMetric', () => {
    it('should simplify metric data', () => {
      const metric = {
        name: 'page_views',
        value: 1000,
        timestamp: '2024-01-15T10:00:00Z',
        group_by: 'browser',
        count: 1000,
        average: 2.5,
        p50: 1.8,
        p95: 5.2,
        p99: 8.1,
      };

      const result = simplifyMetric(metric);

      expect(result.name).toBe('page_views');
      expect(result.percentile50).toBe(1.8);
      expect(result.percentile95).toBe(5.2);
      expect(result.percentile99).toBe(8.1);
    });
  });

  describe('toIsoString', () => {
    it('should convert Date object to ISO string', () => {
      const date = new Date('2024-01-15T12:30:00Z');
      expect(toIsoString(date)).toBe('2024-01-15T12:30:00.000Z');
    });

    it('should convert string date to ISO string', () => {
      expect(toIsoString('2024-01-15T12:30:00Z')).toBe('2024-01-15T12:30:00.000Z');
    });

    it('should convert timestamp number to ISO string', () => {
      const timestamp = 1705322400000; // 2024-01-15T12:00:00Z
      const result = toIsoString(timestamp);
      expect(result).toContain('2024-01-15');
    });
  });

  describe('buildSessionQuery', () => {
    it('should build empty query for empty filters', () => {
      const query = buildSessionQuery({});
      expect(query).toEqual({});
    });

    it('should build query with userId filter', () => {
      const query = buildSessionQuery({ userId: 'user-123' });
      expect(query).toEqual({ user_id: 'user-123' });
    });

    it('should build query with multiple filters', () => {
      const query = buildSessionQuery({
        userId: 'user-123',
        email: 'test@example.com',
        browser: 'Chrome',
        hasError: true,
        minDuration: 60,
      });

      expect(query.user_id).toBe('user-123');
      expect(query.email).toBe('test@example.com');
      expect(query.browser).toBe('Chrome');
      expect(query.has_error).toBe(true);
      expect(query.min_duration).toBe(60);
    });

    it('should convert date filters to ISO strings', () => {
      const query = buildSessionQuery({
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
      });

      expect(query.start_date).toBe('2024-01-01T00:00:00.000Z');
      expect(query.end_date).toBe('2024-01-31T23:59:59.000Z');
    });

    it('should include limit when provided', () => {
      const query = buildSessionQuery({ limit: 50 });
      expect(query.limit).toBe(50);
    });
  });

  describe('validateRequired', () => {
    it('should not throw for valid parameters', () => {
      expect(() => {
        validateRequired({ sessionId: 'session-123', userId: 'user-456' }, ['sessionId', 'userId']);
      }).not.toThrow();
    });

    it('should throw for missing required parameter', () => {
      expect(() => {
        validateRequired({ sessionId: 'session-123' }, ['sessionId', 'userId']);
      }).toThrow('Missing required parameter: userId');
    });

    it('should throw for empty required parameter', () => {
      expect(() => {
        validateRequired({ sessionId: '' }, ['sessionId']);
      }).toThrow('Missing required parameter: sessionId');
    });

    it('should handle empty required array', () => {
      expect(() => {
        validateRequired({}, []);
      }).not.toThrow();
    });
  });
});
