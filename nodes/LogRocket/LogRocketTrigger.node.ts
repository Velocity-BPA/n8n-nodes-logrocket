/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

export class LogRocketTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LogRocket Trigger',
		name: 'logRocketTrigger',
		icon: 'file:logrocket.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Receive webhook notifications from LogRocket alerts',
		defaults: {
			name: 'LogRocket Trigger',
		},
		inputs: [],
		outputs: ['main'],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Any Alert',
						value: 'any',
						description: 'Trigger on any LogRocket alert',
					},
					{
						name: 'Custom Alert',
						value: 'custom_alert',
						description: 'Custom alert conditions met',
					},
					{
						name: 'Error Spike',
						value: 'error_spike',
						description: 'When error rate exceeds threshold',
					},
					{
						name: 'Performance Regression',
						value: 'performance_regression',
						description: 'When performance metrics regress',
					},
					{
						name: 'Rage Click Detected',
						value: 'rage_click',
						description: 'When rage clicks spike',
					},
				],
				default: 'any',
				description: 'The event to listen for',
			},
			{
				displayName: 'Setup Instructions',
				name: 'setupNotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						event: ['any', 'error_spike', 'rage_click', 'performance_regression', 'custom_alert'],
					},
				},
				// eslint-disable-next-line n8n-nodes-base/node-param-description-unencoded-angle-brackets
				description: 'To use this trigger:<br/>1. Copy the webhook URL below<br/>2. Go to LogRocket Dashboard > Alerts<br/>3. Create or edit an alert<br/>4. Add a Webhook notification channel<br/>5. Paste the webhook URL<br/>6. Save the alert',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const event = this.getNodeParameter('event') as string;
		const bodyData = this.getBodyData() as IDataObject;
		const headerData = this.getHeaderData() as IDataObject;

		// Extract alert type from payload
		const alertType = (bodyData.alert_type as string) || (bodyData.type as string) || 'unknown';

		// If filtering by event type, check if it matches
		if (event !== 'any') {
			const typeMapping: Record<string, string[]> = {
				error_spike: ['error_spike', 'error', 'errors'],
				rage_click: ['rage_click', 'rage_click_spike', 'rage'],
				performance_regression: ['performance_regression', 'performance', 'perf'],
				custom_alert: ['custom', 'custom_alert'],
			};

			const validTypes = typeMapping[event] || [event];
			const normalizedAlertType = alertType.toLowerCase().replace(/[_-]/g, '_');

			if (!validTypes.some(t => normalizedAlertType.includes(t))) {
				// Not the event we're looking for, return empty
				return {
					noWebhookResponse: true,
				};
			}
		}

		// Build session URLs if session IDs are provided
		const sessionUrls: string[] = [];
		if (bodyData.session_urls) {
			sessionUrls.push(...(bodyData.session_urls as string[]));
		} else if (bodyData.session_ids && bodyData.app_id) {
			const sessionIds = bodyData.session_ids as string[];
			const appId = bodyData.app_id as string;
			for (const sessionId of sessionIds) {
				sessionUrls.push(`https://app.logrocket.com/${appId}/sessions/${sessionId}`);
			}
		}

		// Construct enhanced response
		const enrichedData: IDataObject = {
			...bodyData,
			_webhook: {
				receivedAt: new Date().toISOString(),
				headers: headerData,
			},
		};

		if (sessionUrls.length > 0 && !bodyData.session_urls) {
			enrichedData.session_urls = sessionUrls;
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray([enrichedData]),
			],
		};
	}
}
