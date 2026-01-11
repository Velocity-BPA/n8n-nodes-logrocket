/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const segmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['segment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a user segment',
				action: 'Create a user segment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete segment',
				action: 'Delete segment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get segment details',
				action: 'Get segment details',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'List segments',
				action: 'List segments',
			},
			{
				name: 'Get Users',
				value: 'getUsers',
				description: 'Get users in segment',
				action: 'Get users in segment',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update segment',
				action: 'Update segment',
			},
		],
		default: 'getAll',
	},
];

export const segmentFields: INodeProperties[] = [
	// Segment ID field
	{
		displayName: 'Segment ID',
		name: 'segmentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['get', 'update', 'delete', 'getUsers'],
			},
		},
		description: 'The ID of the segment',
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
				resource: ['segment'],
				operation: ['create'],
			},
		},
		description: 'The name of the segment',
	},
	// Type field for create
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'User', value: 'user' },
			{ name: 'Session', value: 'session' },
		],
		required: true,
		default: 'user',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['create'],
			},
		},
		description: 'The type of segment',
	},
	// Conditions field for create
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['create'],
			},
		},
		placeholder: 'Add Condition',
		options: [
			{
				name: 'conditionValues',
				displayName: 'Condition',
				values: [
					{
						displayName: 'Field',
						name: 'field',
						type: 'options',
						options: [
							{ name: 'Browser', value: 'browser' },
							{ name: 'Country', value: 'country' },
							{ name: 'Device', value: 'device' },
							{ name: 'Email', value: 'email' },
							{ name: 'Operating System', value: 'os' },
							{ name: 'Session Duration', value: 'session_duration' },
							{ name: 'Trait', value: 'trait' },
							{ name: 'URL', value: 'url' },
						],
						default: 'browser',
						description: 'Field to filter on',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						options: [
							{ name: 'Contains', value: 'contains' },
							{ name: 'Equals', value: 'equals' },
							{ name: 'Greater Than', value: 'gt' },
							{ name: 'Less Than', value: 'lt' },
							{ name: 'Not Equals', value: 'not_equals' },
						],
						default: 'equals',
						description: 'Comparison operator',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value to compare against',
					},
				],
			},
		],
		description: 'Segment condition rules',
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
				resource: ['segment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the segment',
			},
		],
	},
	// Return all for getAll and getUsers
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['getAll', 'getUsers'],
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
				resource: ['segment'],
				operation: ['getAll', 'getUsers'],
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
				resource: ['segment'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Conditions',
				name: 'conditions',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Condition',
				options: [
					{
						name: 'conditionValues',
						displayName: 'Condition',
						values: [
							{
								displayName: 'Field',
								name: 'field',
								type: 'options',
								options: [
									{ name: 'Browser', value: 'browser' },
									{ name: 'Country', value: 'country' },
									{ name: 'Device', value: 'device' },
									{ name: 'Email', value: 'email' },
									{ name: 'Operating System', value: 'os' },
									{ name: 'Session Duration', value: 'session_duration' },
									{ name: 'Trait', value: 'trait' },
									{ name: 'URL', value: 'url' },
								],
								default: 'browser',
							},
							{
								displayName: 'Operator',
								name: 'operator',
								type: 'options',
								options: [
									{ name: 'Contains', value: 'contains' },
									{ name: 'Equals', value: 'equals' },
									{ name: 'Greater Than', value: 'gt' },
									{ name: 'Less Than', value: 'lt' },
									{ name: 'Not Equals', value: 'not_equals' },
								],
								default: 'equals',
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
				description: 'Updated segment conditions',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the segment',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the segment',
			},
		],
	},
];

export const segmentMethods = {
	async getAll(this: any, i: number): Promise<IDataObject[]> {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		
		let segments: IDataObject[];
		if (returnAll) {
			segments = await logrocketApiRequestAllItems.call(this, 'segments', 'GET', '/segments');
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await logrocketApiRequest.call(this, 'GET', '/segments', {}, { limit });
			segments = (response.segments as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		return segments;
	},

	async get(this: any, i: number): Promise<IDataObject> {
		const segmentId = this.getNodeParameter('segmentId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/segments/${segmentId}`);
		return (response.segment as IDataObject) || response;
	},

	async create(this: any, i: number): Promise<IDataObject> {
		const name = this.getNodeParameter('name', i) as string;
		const type = this.getNodeParameter('type', i) as string;
		const conditionsData = this.getNodeParameter('conditions', i, {}) as IDataObject;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const conditions: IDataObject[] = [];
		if (conditionsData.conditionValues && Array.isArray(conditionsData.conditionValues)) {
			for (const condition of conditionsData.conditionValues as IDataObject[]) {
				conditions.push({
					field: condition.field,
					operator: condition.operator,
					value: condition.value,
				});
			}
		}
		
		const body: IDataObject = {
			name,
			type,
			conditions,
		};
		
		if (additionalFields.description) {
			body.description = additionalFields.description;
		}
		
		const response = await logrocketApiRequest.call(this, 'POST', '/segments', body);
		return (response.segment as IDataObject) || response;
	},

	async update(this: any, i: number): Promise<IDataObject> {
		const segmentId = this.getNodeParameter('segmentId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const body: IDataObject = {};
		
		if (updateFields.name) {
			body.name = updateFields.name;
		}
		if (updateFields.description) {
			body.description = updateFields.description;
		}
		
		if (updateFields.conditions) {
			const conditionsData = updateFields.conditions as IDataObject;
			const conditions: IDataObject[] = [];
			if (conditionsData.conditionValues && Array.isArray(conditionsData.conditionValues)) {
				for (const condition of conditionsData.conditionValues as IDataObject[]) {
					conditions.push({
						field: condition.field,
						operator: condition.operator,
						value: condition.value,
					});
				}
			}
			body.conditions = conditions;
		}
		
		const response = await logrocketApiRequest.call(this, 'PATCH', `/segments/${segmentId}`, body);
		return (response.segment as IDataObject) || response;
	},

	async delete(this: any, i: number): Promise<IDataObject> {
		const segmentId = this.getNodeParameter('segmentId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		await logrocketApiRequest.call(this, 'DELETE', `/segments/${segmentId}`);
		return { success: true, segmentId };
	},

	async getUsers(this: any, i: number): Promise<IDataObject[]> {
		const segmentId = this.getNodeParameter('segmentId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		
		let users: IDataObject[];
		if (returnAll) {
			users = await logrocketApiRequestAllItems.call(this, 'users', 'GET', `/segments/${segmentId}/users`);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await logrocketApiRequest.call(this, 'GET', `/segments/${segmentId}/users`, {}, { limit });
			users = (response.users as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		return users;
	},
};
