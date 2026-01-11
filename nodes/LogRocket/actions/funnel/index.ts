/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const funnelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['funnel'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a funnel',
				action: 'Create a funnel',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a funnel',
				action: 'Delete a funnel',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get funnel details',
				action: 'Get funnel details',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'List funnels',
				action: 'List funnels',
			},
			{
				name: 'Get Results',
				value: 'getResults',
				description: 'Get funnel conversion data',
				action: 'Get funnel conversion data',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update funnel configuration',
				action: 'Update funnel configuration',
			},
		],
		default: 'getAll',
	},
];

export const funnelFields: INodeProperties[] = [
	// Funnel ID field
	{
		displayName: 'Funnel ID',
		name: 'funnelId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['funnel'],
				operation: ['get', 'update', 'delete', 'getResults'],
			},
		},
		description: 'The ID of the funnel',
	},
	// Name field for create/update
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['funnel'],
				operation: ['create'],
			},
		},
		description: 'The name of the funnel',
	},
	// Steps field for create
	{
		displayName: 'Steps',
		name: 'steps',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['funnel'],
				operation: ['create'],
			},
		},
		placeholder: 'Add Step',
		options: [
			{
				name: 'stepValues',
				displayName: 'Step',
				values: [
					{
						displayName: 'Step Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the funnel step',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Event', value: 'event' },
							{ name: 'URL', value: 'url' },
						],
						default: 'event',
						description: 'Type of step trigger',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Event name or URL pattern for the step',
					},
				],
			},
		],
		description: 'Funnel step definitions',
	},
	// Return all for getAll
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['funnel'],
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
				resource: ['funnel'],
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
				resource: ['funnel'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the funnel',
			},
			{
				displayName: 'Steps',
				name: 'steps',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Step',
				options: [
					{
						name: 'stepValues',
						displayName: 'Step',
						values: [
							{
								displayName: 'Step Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'Event', value: 'event' },
									{ name: 'URL', value: 'url' },
								],
								default: 'event',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
				description: 'Updated funnel steps',
			},
		],
	},
	// Results options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['funnel'],
				operation: ['getResults'],
			},
		},
		options: [
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for analysis',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for analysis',
			},
		],
	},
];

export const funnelMethods = {
	async getAll(this: any, i: number): Promise<IDataObject[]> {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		
		let funnels: IDataObject[];
		if (returnAll) {
			funnels = await logrocketApiRequestAllItems.call(this, 'funnels', 'GET', '/funnels');
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await logrocketApiRequest.call(this, 'GET', '/funnels', {}, { limit });
			funnels = (response.funnels as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		return funnels;
	},

	async get(this: any, i: number): Promise<IDataObject> {
		const funnelId = this.getNodeParameter('funnelId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/funnels/${funnelId}`);
		return (response.funnel as IDataObject) || response;
	},

	async create(this: any, i: number): Promise<IDataObject> {
		const name = this.getNodeParameter('name', i) as string;
		const stepsData = this.getNodeParameter('steps', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const steps: IDataObject[] = [];
		if (stepsData.stepValues && Array.isArray(stepsData.stepValues)) {
			for (const step of stepsData.stepValues as IDataObject[]) {
				steps.push({
					name: step.name,
					type: step.type,
					value: step.value,
				});
			}
		}
		
		const body: IDataObject = {
			name,
			steps,
		};
		
		const response = await logrocketApiRequest.call(this, 'POST', '/funnels', body);
		return (response.funnel as IDataObject) || response;
	},

	async update(this: any, i: number): Promise<IDataObject> {
		const funnelId = this.getNodeParameter('funnelId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const body: IDataObject = {};
		
		if (updateFields.name) {
			body.name = updateFields.name;
		}
		
		if (updateFields.steps) {
			const stepsData = updateFields.steps as IDataObject;
			const steps: IDataObject[] = [];
			if (stepsData.stepValues && Array.isArray(stepsData.stepValues)) {
				for (const step of stepsData.stepValues as IDataObject[]) {
					steps.push({
						name: step.name,
						type: step.type,
						value: step.value,
					});
				}
			}
			body.steps = steps;
		}
		
		const response = await logrocketApiRequest.call(this, 'PATCH', `/funnels/${funnelId}`, body);
		return (response.funnel as IDataObject) || response;
	},

	async delete(this: any, i: number): Promise<IDataObject> {
		const funnelId = this.getNodeParameter('funnelId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		await logrocketApiRequest.call(this, 'DELETE', `/funnels/${funnelId}`);
		return { success: true, funnelId };
	},

	async getResults(this: any, i: number): Promise<IDataObject> {
		const funnelId = this.getNodeParameter('funnelId', i) as string;
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		const { toIsoString } = await import('../../utils');
		
		const query: IDataObject = {};
		
		if (options.startDate) {
			query.start_date = toIsoString(options.startDate as string);
		}
		if (options.endDate) {
			query.end_date = toIsoString(options.endDate as string);
		}
		
		const response = await logrocketApiRequest.call(this, 'GET', `/funnels/${funnelId}/results`, {}, query);
		return (response.results as IDataObject) || response;
	},
};
