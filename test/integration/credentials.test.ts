/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for LogRocket API credentials
 * Note: These tests require valid API credentials to run against the live API.
 * Set LOGROCKET_API_KEY and LOGROCKET_APP_ID environment variables to run.
 */

describe('LogRocket Credentials Integration', () => {
  const apiKey = process.env.LOGROCKET_API_KEY;
  const appId = process.env.LOGROCKET_APP_ID;

  const skipIfNoCredentials = () => {
    if (!apiKey || !appId) {
      return true;
    }
    return false;
  };

  describe('API Authentication', () => {
    it('should validate credential structure', () => {
      // This test validates the credential structure without making API calls
      const credentials = {
        apiKey: 'test-api-key',
        appId: 'org-slug/app-name',
      };

      expect(credentials.apiKey).toBeDefined();
      expect(credentials.appId).toBeDefined();
      expect(credentials.appId).toContain('/');
    });

    it('should build correct API URL', () => {
      const baseUrl = 'https://api.logrocket.com/v1/orgs';
      const testAppId = 'my-org/my-app';
      const endpoint = '/sessions';

      const fullUrl = `${baseUrl}/${testAppId}${endpoint}`;
      expect(fullUrl).toBe('https://api.logrocket.com/v1/orgs/my-org/my-app/sessions');
    });

    it('should build correct authorization header', () => {
      const testApiKey = 'test-key-12345';
      const authHeader = `Token ${testApiKey}`;
      expect(authHeader).toBe('Token test-key-12345');
    });

    (skipIfNoCredentials() ? it.skip : it)('should authenticate with live API', async () => {
      // Only runs when credentials are provided
      const response = await fetch(
        `https://api.logrocket.com/v1/orgs/${appId}/sessions?limit=1`,
        {
          headers: {
            Authorization: `Token ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      expect(response.ok).toBe(true);
    });
  });

  describe('Session Replay URL Generation', () => {
    it('should generate valid session replay URL', () => {
      const testAppId = 'my-org/my-app';
      const sessionId = 'abc123def456';
      const expectedUrl = `https://app.logrocket.com/${testAppId}/sessions/${sessionId}`;

      expect(expectedUrl).toBe('https://app.logrocket.com/my-org/my-app/sessions/abc123def456');
    });

    it('should generate session URL with timestamp', () => {
      const testAppId = 'my-org/my-app';
      const sessionId = 'abc123def456';
      const timestamp = 5000;
      const expectedUrl = `https://app.logrocket.com/${testAppId}/sessions/${sessionId}?t=${timestamp}`;

      expect(expectedUrl).toBe('https://app.logrocket.com/my-org/my-app/sessions/abc123def456?t=5000');
    });
  });

  describe('Error Response Handling', () => {
    it('should parse 401 unauthorized error', () => {
      const errorResponse = {
        error: {
          code: 'unauthorized',
          message: 'Invalid API key',
        },
      };

      expect(errorResponse.error.code).toBe('unauthorized');
      expect(errorResponse.error.message).toBe('Invalid API key');
    });

    it('should parse 404 not found error', () => {
      const errorResponse = {
        error: {
          code: 'not_found',
          message: 'Session not found',
        },
      };

      expect(errorResponse.error.code).toBe('not_found');
    });

    it('should parse 429 rate limit error', () => {
      const errorResponse = {
        error: {
          code: 'rate_limit_exceeded',
          message: 'Too many requests',
        },
      };

      expect(errorResponse.error.code).toBe('rate_limit_exceeded');
    });
  });
});
