/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get user details',
				action: 'Get user details',
			},
			{
				name: 'Get Activity',
				value: 'getActivity',
				description: 'Get user activity summary',
				action: 'Get user activity summary',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'List users',
				action: 'List users',
			},
			{
				name: 'Get Sessions',
				value: 'getSessions',
				description: 'Get sessions for user',
				action: 'Get sessions for user',
			},
			{
				name: 'Get Traits',
				value: 'getTraits',
				description: 'Get user traits',
				action: 'Get user traits',
			},
			{
				name: 'Identify',
				value: 'identify',
				description: 'Update user identity',
				action: 'Update user identity',
			},
		],
		default: 'getAll',
	},
];

export const userFields: INodeProperties[] = [
	// User ID field
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'getSessions', 'getTraits', 'identify', 'getActivity'],
			},
		},
		description: 'The ID of the user',
	},
	// Identity fields for identify operation
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['identify'],
			},
		},
		description: 'User email address',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['identify'],
			},
		},
		description: 'User display name',
	},
	{
		displayName: 'Traits',
		name: 'traits',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['identify'],
			},
		},
		placeholder: 'Add Trait',
		options: [
			{
				name: 'traitValues',
				displayName: 'Trait',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
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
		description: 'Custom user traits',
	},
	// Return all for getAll and getSessions
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getAll', 'getSessions'],
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
				resource: ['user'],
				operation: ['getAll', 'getSessions'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	// Filters for getAll
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Filter by email',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter users last seen before this date',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter users first seen after this date',
			},
		],
	},
	// Date filters for getActivity
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getActivity'],
			},
		},
		options: [
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Activity end date',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Activity start date',
			},
		],
	},
	// Simplify output option
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'getAll'],
			},
		},
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
];

export const userMethods = {
	async getAll(this: any, i: number): Promise<IDataObject[]> {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const simplify = this.getNodeParameter('simplify', i, true) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		const { simplifyUser, toIsoString } = await import('../../utils');
		
		const query: IDataObject = {};
		
		if (filters.email) {
			query.email = filters.email;
		}
		if (filters.startDate) {
			query.start_date = toIsoString(filters.startDate as string);
		}
		if (filters.endDate) {
			query.end_date = toIsoString(filters.endDate as string);
		}
		
		let users: IDataObject[];
		if (returnAll) {
			users = await logrocketApiRequestAllItems.call(this, 'users', 'GET', '/users', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await logrocketApiRequest.call(this, 'GET', '/users', {}, query);
			users = (response.users as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		if (simplify) {
			return users.map(user => simplifyUser(user));
		}
		return users;
	},

	async get(this: any, i: number): Promise<IDataObject> {
		const userId = this.getNodeParameter('userId', i) as string;
		const simplify = this.getNodeParameter('simplify', i, true) as boolean;
		
		const { logrocketApiRequest } = await import('../../transport');
		const { simplifyUser } = await import('../../utils');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/users/${userId}`);
		const user = (response.user as IDataObject) || response;
		
		if (simplify) {
			return simplifyUser(user);
		}
		return user;
	},

	async getSessions(this: any, i: number): Promise<IDataObject[]> {
		const userId = this.getNodeParameter('userId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		
		let sessions: IDataObject[];
		if (returnAll) {
			sessions = await logrocketApiRequestAllItems.call(this, 'sessions', 'GET', `/users/${userId}/sessions`);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await logrocketApiRequest.call(this, 'GET', `/users/${userId}/sessions`, {}, { limit });
			sessions = (response.sessions as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		return sessions;
	},

	async getTraits(this: any, i: number): Promise<IDataObject> {
		const userId = this.getNodeParameter('userId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/users/${userId}/traits`);
		return (response.traits as IDataObject) || response;
	},

	async identify(this: any, i: number): Promise<IDataObject> {
		const userId = this.getNodeParameter('userId', i) as string;
		const email = this.getNodeParameter('email', i, '') as string;
		const name = this.getNodeParameter('name', i, '') as string;
		const traitsData = this.getNodeParameter('traits', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const body: IDataObject = {
			user_id: userId,
		};
		
		if (email) {
			body.email = email;
		}
		if (name) {
			body.name = name;
		}
		
		// Process traits
		if (traitsData.traitValues && Array.isArray(traitsData.traitValues)) {
			const traits: IDataObject = {};
			for (const trait of traitsData.traitValues as IDataObject[]) {
				traits[trait.key as string] = trait.value;
			}
			body.traits = traits;
		}
		
		const response = await logrocketApiRequest.call(this, 'POST', `/users/${userId}/identify`, body);
		return (response.user as IDataObject) || response;
	},

	async getActivity(this: any, i: number): Promise<IDataObject> {
		const userId = this.getNodeParameter('userId', i) as string;
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
		
		const response = await logrocketApiRequest.call(this, 'GET', `/users/${userId}/activity`, {}, query);
		return (response.activity as IDataObject) || response;
	},
};
