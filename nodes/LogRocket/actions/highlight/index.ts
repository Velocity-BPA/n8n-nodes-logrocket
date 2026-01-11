/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const highlightOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['highlight'],
			},
		},
		options: [
			{
				name: 'Get for Session',
				value: 'getForSession',
				description: 'Get highlights for specific session',
				action: 'Get highlights for session',
			},
			{
				name: 'Get for Time Range',
				value: 'getForTimeRange',
				description: 'Get highlights in time range',
				action: 'Get highlights in time range',
			},
			{
				name: 'Get for User',
				value: 'getForUser',
				description: 'Get session highlights for user',
				action: 'Get session highlights for user',
			},
		],
		default: 'getForUser',
	},
];

export const highlightFields: INodeProperties[] = [
	// User ID field for getForUser
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['getForUser'],
			},
		},
		description: 'The ID of the user to get highlights for',
	},
	// Session ID field for getForSession
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['getForSession'],
			},
		},
		description: 'The ID of the session to get highlights for',
	},
	// Time range fields for getForTimeRange
	{
		displayName: 'Start Time (Ms)',
		name: 'startMs',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['getForTimeRange'],
			},
		},
		description: 'Start timestamp in milliseconds',
	},
	{
		displayName: 'End Time (Ms)',
		name: 'endMs',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['getForTimeRange'],
			},
		},
		description: 'End timestamp in milliseconds',
	},
	// Options for all operations
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['getForUser', 'getForSession', 'getForTimeRange'],
			},
		},
		options: [
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				placeholder: 'https://your-webhook.url/callback',
				description: 'Webhook URL for async delivery of highlights',
			},
		],
	},
	// Additional options for getForUser
	{
		displayName: 'Time Range',
		name: 'timeRange',
		type: 'collection',
		placeholder: 'Add Time Range',
		default: {},
		displayOptions: {
			show: {
				resource: ['highlight'],
				operation: ['getForUser'],
			},
		},
		options: [
			{
				displayName: 'End Time (Ms)',
				name: 'endMs',
				type: 'number',
				default: 0,
				description: 'End timestamp in milliseconds',
			},
			{
				displayName: 'Start Time (Ms)',
				name: 'startMs',
				type: 'number',
				default: 0,
				description: 'Start timestamp in milliseconds',
			},
		],
	},
];

export const highlightMethods = {
	async getForUser(this: any, i: number): Promise<IDataObject> {
		const userId = this.getNodeParameter('userId', i) as string;
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		const timeRange = this.getNodeParameter('timeRange', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const query: IDataObject = {};
		
		if (timeRange.startMs) {
			query.start_ms = timeRange.startMs;
		}
		if (timeRange.endMs) {
			query.end_ms = timeRange.endMs;
		}
		if (options.webhookUrl) {
			query.webhook_url = options.webhookUrl;
		}
		
		const response = await logrocketApiRequest.call(this, 'GET', `/users/${userId}/highlights`, {}, query);
		return response;
	},

	async getForSession(this: any, i: number): Promise<IDataObject> {
		const sessionId = this.getNodeParameter('sessionId', i) as string;
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const query: IDataObject = {};
		
		if (options.webhookUrl) {
			query.webhook_url = options.webhookUrl;
		}
		
		const response = await logrocketApiRequest.call(this, 'GET', `/sessions/${sessionId}/highlights`, {}, query);
		return response;
	},

	async getForTimeRange(this: any, i: number): Promise<IDataObject> {
		const startMs = this.getNodeParameter('startMs', i) as number;
		const endMs = this.getNodeParameter('endMs', i) as number;
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const query: IDataObject = {
			start_ms: startMs,
			end_ms: endMs,
		};
		
		if (options.webhookUrl) {
			query.webhook_url = options.webhookUrl;
		}
		
		const response = await logrocketApiRequest.call(this, 'GET', '/highlights', {}, query);
		return response;
	},
};
