/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const errorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['error'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get error details',
				action: 'Get error details',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'List errors',
				action: 'List errors',
			},
			{
				name: 'Get Occurrences',
				value: 'getOccurrences',
				description: 'Get error occurrences over time',
				action: 'Get error occurrences over time',
			},
			{
				name: 'Get Sessions',
				value: 'getSessions',
				description: 'Get sessions with error',
				action: 'Get sessions with error',
			},
			{
				name: 'Get Stack Trace',
				value: 'getStackTrace',
				description: 'Get error stack trace',
				action: 'Get error stack trace',
			},
		],
		default: 'getAll',
	},
];

export const errorFields: INodeProperties[] = [
	// Error ID field
	{
		displayName: 'Error ID',
		name: 'errorId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['error'],
				operation: ['get', 'getSessions', 'getStackTrace', 'getOccurrences'],
			},
		},
		description: 'The ID of the error',
	},
	// Return all for getAll and getSessions
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['error'],
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
				resource: ['error'],
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
				resource: ['error'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Browser',
				name: 'browser',
				type: 'string',
				default: '',
				description: 'Filter by browser',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter errors occurring before this date',
			},
			{
				displayName: 'Error Message',
				name: 'errorMessage',
				type: 'string',
				default: '',
				description: 'Filter by error message',
			},
			{
				displayName: 'Error Type',
				name: 'errorType',
				type: 'options',
				options: [
					{ name: 'Error', value: 'Error' },
					{ name: 'EvalError', value: 'EvalError' },
					{ name: 'RangeError', value: 'RangeError' },
					{ name: 'ReferenceError', value: 'ReferenceError' },
					{ name: 'SyntaxError', value: 'SyntaxError' },
					{ name: 'TypeError', value: 'TypeError' },
					{ name: 'URIError', value: 'URIError' },
				],
				default: '',
				description: 'Filter by error type',
			},
			{
				displayName: 'Resolved',
				name: 'resolved',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by resolution status',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter errors occurring after this date',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'Page URL where error occurred',
			},
		],
	},
	// Options for getOccurrences
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['error'],
				operation: ['getOccurrences'],
			},
		},
		options: [
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for occurrence data',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'options',
				options: [
					{ name: 'Hour', value: 'hour' },
					{ name: 'Day', value: 'day' },
					{ name: 'Week', value: 'week' },
				],
				default: 'day',
				description: 'Aggregation interval for occurrences',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for occurrence data',
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
				resource: ['error'],
				operation: ['get', 'getAll'],
			},
		},
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
];

export const errorMethods = {
	async getAll(this: any, i: number): Promise<IDataObject[]> {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const simplify = this.getNodeParameter('simplify', i, true) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		const { simplifyError, toIsoString } = await import('../../utils');
		
		const query: IDataObject = {};
		
		if (filters.errorMessage) {
			query.message = filters.errorMessage;
		}
		if (filters.errorType) {
			query.type = filters.errorType;
		}
		if (filters.url) {
			query.url = filters.url;
		}
		if (filters.browser) {
			query.browser = filters.browser;
		}
		if (filters.resolved !== undefined) {
			query.resolved = filters.resolved;
		}
		if (filters.startDate) {
			query.start_date = toIsoString(filters.startDate as string);
		}
		if (filters.endDate) {
			query.end_date = toIsoString(filters.endDate as string);
		}
		
		let errors: IDataObject[];
		if (returnAll) {
			errors = await logrocketApiRequestAllItems.call(this, 'errors', 'GET', '/errors', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await logrocketApiRequest.call(this, 'GET', '/errors', {}, query);
			errors = (response.errors as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		if (simplify) {
			return errors.map(error => simplifyError(error));
		}
		return errors;
	},

	async get(this: any, i: number): Promise<IDataObject> {
		const errorId = this.getNodeParameter('errorId', i) as string;
		const simplify = this.getNodeParameter('simplify', i, true) as boolean;
		
		const { logrocketApiRequest } = await import('../../transport');
		const { simplifyError } = await import('../../utils');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/errors/${errorId}`);
		const errorData = (response.error as IDataObject) || response;
		
		if (simplify) {
			return simplifyError(errorData);
		}
		return errorData;
	},

	async getSessions(this: any, i: number): Promise<IDataObject[]> {
		const errorId = this.getNodeParameter('errorId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		
		let sessions: IDataObject[];
		if (returnAll) {
			sessions = await logrocketApiRequestAllItems.call(this, 'sessions', 'GET', `/errors/${errorId}/sessions`);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await logrocketApiRequest.call(this, 'GET', `/errors/${errorId}/sessions`, {}, { limit });
			sessions = (response.sessions as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		return sessions;
	},

	async getStackTrace(this: any, i: number): Promise<IDataObject> {
		const errorId = this.getNodeParameter('errorId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/errors/${errorId}/stacktrace`);
		return (response.stacktrace as IDataObject) || response;
	},

	async getOccurrences(this: any, i: number): Promise<IDataObject[]> {
		const errorId = this.getNodeParameter('errorId', i) as string;
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
		if (options.interval) {
			query.interval = options.interval;
		}
		
		const response = await logrocketApiRequest.call(this, 'GET', `/errors/${errorId}/occurrences`, {}, query);
		return (response.occurrences as IDataObject[]) || (response.data as IDataObject[]) || [];
	},
};
