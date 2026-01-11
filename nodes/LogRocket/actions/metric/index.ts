/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const metricOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['metric'],
			},
		},
		options: [
			{
				name: 'Get Custom Metrics',
				value: 'getCustomMetrics',
				description: 'Get custom metrics data',
				action: 'Get custom metrics data',
			},
			{
				name: 'Get Error Metrics',
				value: 'getErrorMetrics',
				description: 'Get error rate metrics',
				action: 'Get error rate metrics',
			},
			{
				name: 'Get Page Views',
				value: 'getPageViews',
				description: 'Get page view metrics',
				action: 'Get page view metrics',
			},
			{
				name: 'Get Performance Metrics',
				value: 'getPerformanceMetrics',
				description: 'Get performance metrics (LCP, FID, CLS)',
				action: 'Get performance metrics',
			},
			{
				name: 'Get Session Metrics',
				value: 'getSessionMetrics',
				description: 'Get session count metrics',
				action: 'Get session count metrics',
			},
		],
		default: 'getPageViews',
	},
];

export const metricFields: INodeProperties[] = [
	// Metric Name for custom metrics
	{
		displayName: 'Metric Name',
		name: 'metricName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['getCustomMetrics'],
			},
		},
		description: 'The name of the custom metric',
	},
	// Performance metric type
	{
		displayName: 'Performance Metric',
		name: 'performanceMetric',
		type: 'options',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Cumulative Layout Shift (CLS)', value: 'cls' },
			{ name: 'First Contentful Paint (FCP)', value: 'fcp' },
			{ name: 'First Input Delay (FID)', value: 'fid' },
			{ name: 'Interaction to Next Paint (INP)', value: 'inp' },
			{ name: 'Largest Contentful Paint (LCP)', value: 'lcp' },
			{ name: 'Time to First Byte (TTFB)', value: 'ttfb' },
		],
		default: 'all',
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['getPerformanceMetrics'],
			},
		},
		description: 'The specific performance metric to retrieve',
	},
	// Common options for all metric operations
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['metric'],
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
				type: 'options',
				options: [
					{ name: 'None', value: '' },
					{ name: 'Browser', value: 'browser' },
					{ name: 'Device', value: 'device' },
					{ name: 'Operating System', value: 'os' },
					{ name: 'URL', value: 'url' },
				],
				default: '',
				description: 'Group metrics by field',
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
	// Filters for page views and sessions
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['getPageViews', 'getSessionMetrics'],
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
				displayName: 'Operating System',
				name: 'os',
				type: 'string',
				default: '',
				description: 'Filter by operating system',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'Filter by URL',
			},
		],
	},
];

export const metricMethods = {
	async getPageViews(this: any, i: number): Promise<IDataObject[]> {
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		const { toIsoString, simplifyMetric } = await import('../../utils');
		
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
		if (filters.url) {
			query.url = filters.url;
		}
		if (filters.browser) {
			query.browser = filters.browser;
		}
		if (filters.os) {
			query.os = filters.os;
		}
		
		const response = await logrocketApiRequest.call(this, 'GET', '/metrics/pageviews', {}, query);
		const metrics = (response.metrics as IDataObject[]) || (response.data as IDataObject[]) || [];
		return metrics.map(metric => simplifyMetric(metric));
	},

	async getSessionMetrics(this: any, i: number): Promise<IDataObject[]> {
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		const { toIsoString, simplifyMetric } = await import('../../utils');
		
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
		if (filters.url) {
			query.url = filters.url;
		}
		if (filters.browser) {
			query.browser = filters.browser;
		}
		if (filters.os) {
			query.os = filters.os;
		}
		
		const response = await logrocketApiRequest.call(this, 'GET', '/metrics/sessions', {}, query);
		const metrics = (response.metrics as IDataObject[]) || (response.data as IDataObject[]) || [];
		return metrics.map(metric => simplifyMetric(metric));
	},

	async getErrorMetrics(this: any, i: number): Promise<IDataObject[]> {
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		const { toIsoString, simplifyMetric } = await import('../../utils');
		
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
		
		const response = await logrocketApiRequest.call(this, 'GET', '/metrics/errors', {}, query);
		const metrics = (response.metrics as IDataObject[]) || (response.data as IDataObject[]) || [];
		return metrics.map(metric => simplifyMetric(metric));
	},

	async getPerformanceMetrics(this: any, i: number): Promise<IDataObject[]> {
		const performanceMetric = this.getNodeParameter('performanceMetric', i) as string;
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		const { toIsoString, simplifyMetric } = await import('../../utils');
		
		const query: IDataObject = {};
		
		if (performanceMetric && performanceMetric !== 'all') {
			query.metric = performanceMetric;
		}
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
		
		const response = await logrocketApiRequest.call(this, 'GET', '/metrics/performance', {}, query);
		const metrics = (response.metrics as IDataObject[]) || (response.data as IDataObject[]) || [];
		return metrics.map(metric => simplifyMetric(metric));
	},

	async getCustomMetrics(this: any, i: number): Promise<IDataObject[]> {
		const metricName = this.getNodeParameter('metricName', i) as string;
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		const { toIsoString, simplifyMetric } = await import('../../utils');
		
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
		
		const response = await logrocketApiRequest.call(this, 'GET', `/metrics/custom/${encodeURIComponent(metricName)}`, {}, query);
		const metrics = (response.metrics as IDataObject[]) || (response.data as IDataObject[]) || [];
		return metrics.map(metric => simplifyMetric(metric));
	},
};
