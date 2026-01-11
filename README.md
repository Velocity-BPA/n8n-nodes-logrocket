# n8n-nodes-logrocket

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for LogRocket, the leading frontend session replay and product analytics platform. This node enables workflow automation for session management, user identification, issue tracking, and integration with support and development workflows.

![n8n](https://img.shields.io/badge/n8n-community%20node-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)

## Features

- **Session Replay**: Access session recordings, events, errors, network requests, and console logs
- **User Analytics**: Track user behavior, traits, and activity patterns
- **Issue Tracking**: Manage errors, rage clicks, and performance issues
- **Error Monitoring**: Track JavaScript errors, stack traces, and occurrence patterns
- **Custom Events**: Access and analyze custom tracking events
- **Galileo Highlights**: AI-powered session highlights for quick insights
- **Performance Metrics**: Monitor LCP, FID, CLS, INP, TTFB, and custom metrics
- **Funnels & Segments**: Create and analyze conversion funnels and user segments
- **Alerts**: Configure and manage alerts with webhook notifications
- **Team Management**: Manage team members, roles, and permissions
- **Project Settings**: Configure SDK settings and privacy controls

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-logrocket`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-logrocket

# Restart n8n
```

### Development Installation

```bash
# Clone or extract the package
cd n8n-nodes-logrocket

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-logrocket

# Restart n8n
n8n start
```

## Credentials Setup

To use this node, you need a LogRocket API key and Application ID.

### Obtaining Credentials

1. Log into your [LogRocket Dashboard](https://app.logrocket.com)
2. Navigate to **Settings** > **General Settings**
3. Locate or generate your **API Access Key**
4. Note your **Application ID** (format: `org-slug/app-name`)

### Credential Configuration

| Field | Description | Example |
|-------|-------------|---------|
| API Key | Your LogRocket API Access Key | `lr_abc123...` |
| App ID | Your Application ID | `my-org/my-app` |

## Resources & Operations

### Session
| Operation | Description |
|-----------|-------------|
| Get | Get session details |
| Get All | List sessions with filtering |
| Get Console Logs | Get console logs from session |
| Get Errors | Get errors from session |
| Get Events | Get session events |
| Get Network Requests | Get network activity |
| Get Performance | Get performance metrics |
| Get Session URL | Get session replay URL |

### User
| Operation | Description |
|-----------|-------------|
| Get | Get user details |
| Get All | List users |
| Get Activity | Get user activity summary |
| Get Sessions | Get sessions for user |
| Get Traits | Get user traits |
| Identify | Update user identity |

### Issue
| Operation | Description |
|-----------|-------------|
| Get | Get issue details |
| Get All | List issues |
| Get Sessions | Get sessions with issue |
| Assign | Assign to team member |
| Ignore | Ignore an issue |
| Resolve | Mark as resolved |

### Error
| Operation | Description |
|-----------|-------------|
| Get | Get error details |
| Get All | List errors |
| Get Occurrences | Get occurrence timeline |
| Get Sessions | Get sessions with error |
| Get Stack Trace | Get error stack trace |

### Event
| Operation | Description |
|-----------|-------------|
| Get | Get event details |
| Get All | List custom events |
| Get Metrics | Get event metrics/counts |
| Get Sessions | Get sessions with event |

### Highlight (Galileo)
| Operation | Description |
|-----------|-------------|
| Get For Session | Get highlights for session |
| Get For Time Range | Get highlights in time range |
| Get For User | Get highlights for user |

### Metric
| Operation | Description |
|-----------|-------------|
| Get Custom Metrics | Get custom metrics data |
| Get Error Metrics | Get error rate metrics |
| Get Page Views | Get page view metrics |
| Get Performance Metrics | Get LCP, FID, CLS metrics |
| Get Session Metrics | Get session count metrics |

### Funnel
| Operation | Description |
|-----------|-------------|
| Create | Create a funnel |
| Delete | Delete a funnel |
| Get | Get funnel details |
| Get All | List funnels |
| Get Results | Get conversion data |
| Update | Update funnel config |

### Segment
| Operation | Description |
|-----------|-------------|
| Create | Create a segment |
| Delete | Delete a segment |
| Get | Get segment details |
| Get All | List segments |
| Get Users | Get users in segment |
| Update | Update segment |

### Alert
| Operation | Description |
|-----------|-------------|
| Create | Create an alert |
| Delete | Delete an alert |
| Disable | Disable alert |
| Enable | Enable alert |
| Get | Get alert details |
| Get All | List alerts |
| Update | Update alert config |

### Team
| Operation | Description |
|-----------|-------------|
| Get | Get member details |
| Get All | List team members |
| Invite | Invite team member |
| Remove | Remove team member |
| Update Role | Update member role |

### Project
| Operation | Description |
|-----------|-------------|
| Get | Get project details |
| Get All | List projects |
| Get SDK Config | Get SDK configuration |
| Update | Update project settings |

## Trigger Node

The **LogRocket Trigger** node receives webhook notifications from LogRocket alerts.

### Supported Events

- **Any Alert**: Trigger on any LogRocket alert
- **Error Spike**: When error rate exceeds threshold
- **Rage Click Detected**: When rage clicks spike
- **Performance Regression**: When performance metrics regress
- **Custom Alert**: Custom alert conditions met

### Webhook Setup

1. In n8n, add the **LogRocket Trigger** node
2. Copy the webhook URL shown
3. In LogRocket Dashboard, go to **Alerts**
4. Create or edit an alert
5. Add a **Webhook** notification channel
6. Paste the n8n webhook URL
7. Save the alert

## Usage Examples

### Get Sessions with Errors

```json
{
  "resource": "session",
  "operation": "getAll",
  "filters": {
    "hasError": true,
    "startDate": "2024-01-01T00:00:00Z"
  },
  "limit": 50
}
```

### Get User Session Replay URL

```json
{
  "resource": "session",
  "operation": "getSessionUrl",
  "sessionId": "abc123def456",
  "timestamp": 5000
}
```

### Track Error Occurrences

```json
{
  "resource": "error",
  "operation": "getOccurrences",
  "errorId": "error-123",
  "interval": "day"
}
```

### Create Performance Alert

```json
{
  "resource": "alert",
  "operation": "create",
  "name": "High LCP Alert",
  "type": "performance_regression",
  "threshold": 2500,
  "comparison": "greater_than",
  "window": "1h",
  "channels": ["email", "webhook"]
}
```

## LogRocket Concepts

### Session Replay
LogRocket records user sessions including DOM changes, network requests, console logs, and JavaScript errors. Each session has a unique ID and can be accessed via the session replay URL.

### Galileo Highlights
Galileo is LogRocket's AI that automatically identifies interesting moments in session recordings, such as errors, rage clicks, and user frustration signals.

### Performance Metrics
- **LCP** (Largest Contentful Paint): Loading performance
- **FID** (First Input Delay): Interactivity
- **CLS** (Cumulative Layout Shift): Visual stability
- **INP** (Interaction to Next Paint): Responsiveness
- **TTFB** (Time to First Byte): Server response time

### User Identification
Users can be identified with custom IDs, emails, and traits to track behavior across sessions.

## Error Handling

The node handles common API errors:

| Code | Description |
|------|-------------|
| 400 | Invalid parameters |
| 401 | Invalid API key |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | LogRocket server error |

Enable **Continue On Fail** in the node settings to handle errors gracefully without stopping the workflow.

## Security Best Practices

1. **API Key Storage**: Store API keys securely in n8n credentials
2. **Access Control**: Use minimal required permissions
3. **Data Privacy**: Be mindful of PII in session data
4. **Webhook Security**: Use HTTPS for webhook endpoints
5. **Rate Limiting**: Implement appropriate delays for bulk operations

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (`npm test`)
5. Submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-logrocket/issues)
- **Documentation**: [LogRocket API Docs](https://docs.logrocket.com/reference)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)

## Acknowledgments

- [LogRocket](https://logrocket.com) for their excellent session replay platform
- [n8n](https://n8n.io) for the workflow automation platform
- The n8n community for their support and feedback
