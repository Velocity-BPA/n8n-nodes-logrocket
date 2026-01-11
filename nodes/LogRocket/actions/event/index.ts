/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get event details',
				action: 'Get event details',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'List custom events',
				action: 'List custom events',
			},
			{
				name: 'Get Metrics',
				value: 'getMetrics',
				description: 'Get event metrics/counts',
				action: 'Get event metrics and counts',
			},
			{
				name: 'Get Sessions',
				value: 'getSessions',
				description: 'Get sessions with event',
				action: 'Get sessions with event',
			},
		],
		default: 'getAll',
	},
];

export const eventFields: INodeProperties[] = [
	// Event Name field
	{
		displayName: 'Event Name',
		name: 'eventName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['get', 'getSessions', 'getMetrics'],
			},
		},
		description: 'The name of the event',
	},
	// Return all for getAll and getSessions
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['event'],
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
				resource: ['event'],
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
				resource: ['event'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter events occurring before this date',
			},
			{
				displayName: 'Event Name',
				name: 'eventName',
				type: 'string',
				default: '',
				description: 'Filter by event name',
			},
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'options',
				options: [
					{ name: 'Track', value: 'track' },
					{ name: 'Identify', value: 'identify' },
					{ name: 'Page', value: 'page' },
				],
				default: '',
				description: 'Filter by event type',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter events occurring after this date',
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
	// Options for getSessions
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getSessions'],
			},
		},
		options: [
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter sessions before this date',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter sessions after this date',
			},
		],
	},
	// Options for getMetrics
	{
		displayName: 'Options',
		name: 'metricOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['getMetrics'],
			},
		},
		options: [
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for metric data',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'string',
				default: '',
				description: 'Group metrics by this property',
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
				description: 'Aggregation interval',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for metric data',
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
				resource: ['event'],
				operation: ['get', 'getAll'],
			},
		},
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
];

export const eventMethods = {
	async getAll(this: any, i: number): Promise<IDataObject[]> {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const simplify = this.getNodeParameter('simplify', i, true) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		const { simplifyEvent, toIsoString } = await import('../../utils');
		
		const query: IDataObject = {};
		
		if (filters.eventName) {
			query.name = filters.eventName;
		}
		if (filters.eventType) {
			query.type = filters.eventType;
		}
		if (filters.userId) {
			query.user_id = filters.userId;
		}
		if (filters.startDate) {
			query.start_date = toIsoString(filters.startDate as string);
		}
		if (filters.endDate) {
			query.end_date = toIsoString(filters.endDate as string);
		}
		
		let events: IDataObject[];
		if (returnAll) {
			events = await logrocketApiRequestAllItems.call(this, 'events', 'GET', '/events', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await logrocketApiRequest.call(this, 'GET', '/events', {}, query);
			events = (response.events as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		if (simplify) {
			return events.map(event => simplifyEvent(event));
		}
		return events;
	},

	async get(this: any, i: number): Promise<IDataObject> {
		const eventName = this.getNodeParameter('eventName', i) as string;
		const simplify = this.getNodeParameter('simplify', i, true) as boolean;
		
		const { logrocketApiRequest } = await import('../../transport');
		const { simplifyEvent } = await import('../../utils');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/events/${encodeURIComponent(eventName)}`);
		const event = (response.event as IDataObject) || response;
		
		if (simplify) {
			return simplifyEvent(event);
		}
		return event;
	},

	async getSessions(this: any, i: number): Promise<IDataObject[]> {
		const eventName = this.getNodeParameter('eventName', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		const { toIsoString } = await import('../../utils');
		
		const query: IDataObject = {};
		
		if (options.startDate) {
			query.start_date = toIsoString(options.startDate as string);
		}
		if (options.endDate) {
			query.end_date = toIsoString(options.endDate as string);
		}
		
		let sessions: IDataObject[];
		if (returnAll) {
			sessions = await logrocketApiRequestAllItems.call(this, 'sessions', 'GET', `/events/${encodeURIComponent(eventName)}/sessions`, {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await logrocketApiRequest.call(this, 'GET', `/events/${encodeURIComponent(eventName)}/sessions`, {}, query);
			sessions = (response.sessions as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		return sessions;
	},

	async getMetrics(this: any, i: number): Promise<IDataObject[]> {
		const eventName = this.getNodeParameter('eventName', i) as string;
		const options = this.getNodeParameter('metricOptions', i, {}) as IDataObject;
		
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
		if (options.groupBy) {
			query.group_by = options.groupBy;
		}
		
		const response = await logrocketApiRequest.call(this, 'GET', `/events/${encodeURIComponent(eventName)}/metrics`, {}, query);
		return (response.metrics as IDataObject[]) || (response.data as IDataObject[]) || [];
	},
};
