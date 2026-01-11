/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const sessionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['session'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get session details',
				action: 'Get session details',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'List sessions with filtering',
				action: 'List sessions',
			},
			{
				name: 'Get Console Logs',
				value: 'getConsoleLogs',
				description: 'Get console logs from session',
				action: 'Get console logs from session',
			},
			{
				name: 'Get Errors',
				value: 'getErrors',
				description: 'Get errors from session',
				action: 'Get errors from session',
			},
			{
				name: 'Get Events',
				value: 'getEvents',
				description: 'Get session events',
				action: 'Get session events',
			},
			{
				name: 'Get Network Requests',
				value: 'getNetworkRequests',
				description: 'Get network activity from session',
				action: 'Get network activity from session',
			},
			{
				name: 'Get Performance',
				value: 'getPerformance',
				description: 'Get performance metrics from session',
				action: 'Get performance metrics from session',
			},
			{
				name: 'Get Session URL',
				value: 'getSessionUrl',
				description: 'Get session replay URL',
				action: 'Get session replay URL',
			},
		],
		default: 'getAll',
	},
];

export const sessionFields: INodeProperties[] = [
	// Session ID field for get, getEvents, getErrors, etc.
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['get', 'getEvents', 'getErrors', 'getNetworkRequests', 'getConsoleLogs', 'getPerformance', 'getSessionUrl'],
			},
		},
		description: 'The ID of the session',
	},
	// Timestamp for session URL
	{
		displayName: 'Timestamp (Ms)',
		name: 'timestamp',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['getSessionUrl'],
			},
		},
		description: 'Optional timestamp in milliseconds to jump to in the replay',
	},
	// Return all for getAll
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['session'],
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
				resource: ['session'],
				operation: ['getAll'],
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
				resource: ['session'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Browser',
				name: 'browser',
				type: 'string',
				default: '',
				description: 'Filter by browser type',
			},
			{
				displayName: 'Device',
				name: 'device',
				type: 'string',
				default: '',
				description: 'Filter by device type',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Filter by user email',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter sessions ending before this date',
			},
			{
				displayName: 'Has Error',
				name: 'hasError',
				type: 'boolean',
				default: false,
				description: 'Whether to filter sessions with errors',
			},
			{
				displayName: 'Min Duration (Seconds)',
				name: 'minDuration',
				type: 'number',
				default: 0,
				description: 'Minimum session duration in seconds',
			},
			{
				displayName: 'Operating System',
				name: 'os',
				type: 'string',
				default: '',
				description: 'Filter by operating system',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter sessions starting after this date',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'Filter by URL visited',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'Filter by user ID',
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
				resource: ['session'],
				operation: ['get', 'getAll'],
			},
		},
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
];

export const sessionMethods = {
	async getAll(this: any, i: number): Promise<IDataObject[]> {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const simplify = this.getNodeParameter('simplify', i, true) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		const { buildSessionQuery, simplifySession } = await import('../../utils');
		
		const credentials = await this.getCredentials('logrocketApi');
		const appId = credentials.appId as string;
		
		const query = buildSessionQuery(filters);
		
		let sessions: IDataObject[];
		if (returnAll) {
			sessions = await logrocketApiRequestAllItems.call(this, 'sessions', 'GET', '/sessions', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await logrocketApiRequest.call(this, 'GET', '/sessions', {}, query);
			sessions = (response.sessions as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		if (simplify) {
			return sessions.map(session => simplifySession(session, appId));
		}
		return sessions;
	},

	async get(this: any, i: number): Promise<IDataObject> {
		const sessionId = this.getNodeParameter('sessionId', i) as string;
		const simplify = this.getNodeParameter('simplify', i, true) as boolean;
		
		const { logrocketApiRequest } = await import('../../transport');
		const { simplifySession } = await import('../../utils');
		
		const credentials = await this.getCredentials('logrocketApi');
		const appId = credentials.appId as string;
		
		const response = await logrocketApiRequest.call(this, 'GET', `/sessions/${sessionId}`);
		const session = (response.session as IDataObject) || response;
		
		if (simplify) {
			return simplifySession(session, appId);
		}
		return session;
	},

	async getEvents(this: any, i: number): Promise<IDataObject[]> {
		const sessionId = this.getNodeParameter('sessionId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/sessions/${sessionId}/events`);
		return (response.events as IDataObject[]) || (response.data as IDataObject[]) || [];
	},

	async getErrors(this: any, i: number): Promise<IDataObject[]> {
		const sessionId = this.getNodeParameter('sessionId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/sessions/${sessionId}/errors`);
		return (response.errors as IDataObject[]) || (response.data as IDataObject[]) || [];
	},

	async getNetworkRequests(this: any, i: number): Promise<IDataObject[]> {
		const sessionId = this.getNodeParameter('sessionId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/sessions/${sessionId}/network`);
		return (response.requests as IDataObject[]) || (response.network as IDataObject[]) || (response.data as IDataObject[]) || [];
	},

	async getConsoleLogs(this: any, i: number): Promise<IDataObject[]> {
		const sessionId = this.getNodeParameter('sessionId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/sessions/${sessionId}/console`);
		return (response.logs as IDataObject[]) || (response.console as IDataObject[]) || (response.data as IDataObject[]) || [];
	},

	async getPerformance(this: any, i: number): Promise<IDataObject> {
		const sessionId = this.getNodeParameter('sessionId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/sessions/${sessionId}/performance`);
		return (response.performance as IDataObject) || response;
	},

	async getSessionUrl(this: any, i: number): Promise<IDataObject> {
		const sessionId = this.getNodeParameter('sessionId', i) as string;
		const timestamp = this.getNodeParameter('timestamp', i, 0) as number;
		
		const { buildSessionUrl } = await import('../../transport');
		
		const credentials = await this.getCredentials('logrocketApi');
		const appId = credentials.appId as string;
		
		const url = buildSessionUrl(appId, sessionId, timestamp || undefined);
		
		return {
			sessionId,
			url,
			timestamp: timestamp || null,
		};
	},
};
