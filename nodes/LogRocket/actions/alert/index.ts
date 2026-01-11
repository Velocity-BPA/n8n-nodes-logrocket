/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const alertOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['alert'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an alert',
				action: 'Create an alert',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete alert',
				action: 'Delete alert',
			},
			{
				name: 'Disable',
				value: 'disable',
				description: 'Disable alert',
				action: 'Disable alert',
			},
			{
				name: 'Enable',
				value: 'enable',
				description: 'Enable alert',
				action: 'Enable alert',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get alert details',
				action: 'Get alert details',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'List alerts',
				action: 'List alerts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update alert configuration',
				action: 'Update alert configuration',
			},
		],
		default: 'getAll',
	},
];

export const alertFields: INodeProperties[] = [
	// Alert ID field
	{
		displayName: 'Alert ID',
		name: 'alertId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['get', 'update', 'delete', 'enable', 'disable'],
			},
		},
		description: 'The ID of the alert',
	},
	// Name field for create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['create'],
			},
		},
		description: 'The name of the alert',
	},
	// Type field for create
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Error Spike', value: 'error_spike' },
			{ name: 'Performance Regression', value: 'performance_regression' },
			{ name: 'Rage Click Spike', value: 'rage_click_spike' },
		],
		required: true,
		default: 'error_spike',
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['create'],
			},
		},
		description: 'The type of alert',
	},
	// Threshold field for create
	{
		displayName: 'Threshold',
		name: 'threshold',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['create'],
			},
		},
		description: 'Alert threshold value',
	},
	// Comparison field for create
	{
		displayName: 'Comparison',
		name: 'comparison',
		type: 'options',
		options: [
			{ name: 'Equals', value: 'equals' },
			{ name: 'Greater Than', value: 'greater_than' },
			{ name: 'Less Than', value: 'less_than' },
		],
		required: true,
		default: 'greater_than',
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['create'],
			},
		},
		description: 'Comparison operator for threshold',
	},
	// Window field for create
	{
		displayName: 'Window',
		name: 'window',
		type: 'options',
		options: [
			{ name: '5 Minutes', value: '5m' },
			{ name: '15 Minutes', value: '15m' },
			{ name: '30 Minutes', value: '30m' },
			{ name: '1 Hour', value: '1h' },
			{ name: '4 Hours', value: '4h' },
			{ name: '24 Hours', value: '24h' },
		],
		required: true,
		default: '1h',
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['create'],
			},
		},
		description: 'Time window for evaluation',
	},
	// Channels field for create
	{
		displayName: 'Channels',
		name: 'channels',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['create'],
			},
		},
		placeholder: 'Add Channel',
		options: [
			{
				name: 'channelValues',
				displayName: 'Channel',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Email', value: 'email' },
							{ name: 'Slack', value: 'slack' },
							{ name: 'Webhook', value: 'webhook' },
						],
						default: 'email',
						description: 'Notification channel type',
					},
					{
						displayName: 'Target',
						name: 'target',
						type: 'string',
						default: '',
						description: 'Email address, Slack channel, or webhook URL',
					},
				],
			},
		],
		description: 'Notification channels',
	},
	// Additional fields for create
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the alert is enabled',
			},
		],
	},
	// Return all for getAll
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Channels',
				name: 'channels',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Channel',
				options: [
					{
						name: 'channelValues',
						displayName: 'Channel',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'Email', value: 'email' },
									{ name: 'Slack', value: 'slack' },
									{ name: 'Webhook', value: 'webhook' },
								],
								default: 'email',
							},
							{
								displayName: 'Target',
								name: 'target',
								type: 'string',
								default: '',
							},
						],
					},
				],
				description: 'Updated notification channels',
			},
			{
				displayName: 'Comparison',
				name: 'comparison',
				type: 'options',
				options: [
					{ name: 'Equals', value: 'equals' },
					{ name: 'Greater Than', value: 'greater_than' },
					{ name: 'Less Than', value: 'less_than' },
				],
				default: 'greater_than',
				description: 'New comparison operator',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the alert is enabled',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the alert',
			},
			{
				displayName: 'Threshold',
				name: 'threshold',
				type: 'number',
				default: 0,
				description: 'New threshold value',
			},
			{
				displayName: 'Window',
				name: 'window',
				type: 'options',
				options: [
					{ name: '5 Minutes', value: '5m' },
					{ name: '15 Minutes', value: '15m' },
					{ name: '30 Minutes', value: '30m' },
					{ name: '1 Hour', value: '1h' },
					{ name: '4 Hours', value: '4h' },
					{ name: '24 Hours', value: '24h' },
				],
				default: '1h',
				description: 'New time window',
			},
		],
	},
];

export const alertMethods = {
	async getAll(this: any, i: number): Promise<IDataObject[]> {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		
		let alerts: IDataObject[];
		if (returnAll) {
			alerts = await logrocketApiRequestAllItems.call(this, 'alerts', 'GET', '/alerts');
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await logrocketApiRequest.call(this, 'GET', '/alerts', {}, { limit });
			alerts = (response.alerts as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		return alerts;
	},

	async get(this: any, i: number): Promise<IDataObject> {
		const alertId = this.getNodeParameter('alertId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/alerts/${alertId}`);
		return (response.alert as IDataObject) || response;
	},

	async create(this: any, i: number): Promise<IDataObject> {
		const name = this.getNodeParameter('name', i) as string;
		const type = this.getNodeParameter('type', i) as string;
		const threshold = this.getNodeParameter('threshold', i) as number;
		const comparison = this.getNodeParameter('comparison', i) as string;
		const window = this.getNodeParameter('window', i) as string;
		const channelsData = this.getNodeParameter('channels', i, {}) as IDataObject;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const channels: IDataObject[] = [];
		if (channelsData.channelValues && Array.isArray(channelsData.channelValues)) {
			for (const channel of channelsData.channelValues as IDataObject[]) {
				channels.push({
					type: channel.type,
					target: channel.target,
				});
			}
		}
		
		const body: IDataObject = {
			name,
			type,
			threshold,
			comparison,
			window,
			channels,
		};
		
		if (additionalFields.enabled !== undefined) {
			body.enabled = additionalFields.enabled;
		}
		
		const response = await logrocketApiRequest.call(this, 'POST', '/alerts', body);
		return (response.alert as IDataObject) || response;
	},

	async update(this: any, i: number): Promise<IDataObject> {
		const alertId = this.getNodeParameter('alertId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const body: IDataObject = {};
		
		if (updateFields.name) {
			body.name = updateFields.name;
		}
		if (updateFields.threshold !== undefined) {
			body.threshold = updateFields.threshold;
		}
		if (updateFields.comparison) {
			body.comparison = updateFields.comparison;
		}
		if (updateFields.window) {
			body.window = updateFields.window;
		}
		if (updateFields.enabled !== undefined) {
			body.enabled = updateFields.enabled;
		}
		
		if (updateFields.channels) {
			const channelsData = updateFields.channels as IDataObject;
			const channels: IDataObject[] = [];
			if (channelsData.channelValues && Array.isArray(channelsData.channelValues)) {
				for (const channel of channelsData.channelValues as IDataObject[]) {
					channels.push({
						type: channel.type,
						target: channel.target,
					});
				}
			}
			body.channels = channels;
		}
		
		const response = await logrocketApiRequest.call(this, 'PATCH', `/alerts/${alertId}`, body);
		return (response.alert as IDataObject) || response;
	},

	async delete(this: any, i: number): Promise<IDataObject> {
		const alertId = this.getNodeParameter('alertId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		await logrocketApiRequest.call(this, 'DELETE', `/alerts/${alertId}`);
		return { success: true, alertId };
	},

	async enable(this: any, i: number): Promise<IDataObject> {
		const alertId = this.getNodeParameter('alertId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'POST', `/alerts/${alertId}/enable`);
		return (response.alert as IDataObject) || response;
	},

	async disable(this: any, i: number): Promise<IDataObject> {
		const alertId = this.getNodeParameter('alertId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'POST', `/alerts/${alertId}/disable`);
		return (response.alert as IDataObject) || response;
	},
};
