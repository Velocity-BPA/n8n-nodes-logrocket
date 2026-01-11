/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const issueOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['issue'],
			},
		},
		options: [
			{
				name: 'Assign',
				value: 'assign',
				description: 'Assign issue to team member',
				action: 'Assign issue to team member',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get issue details',
				action: 'Get issue details',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'List issues',
				action: 'List issues',
			},
			{
				name: 'Get Sessions',
				value: 'getSessions',
				description: 'Get sessions with issue',
				action: 'Get sessions with issue',
			},
			{
				name: 'Ignore',
				value: 'ignore',
				description: 'Ignore an issue',
				action: 'Ignore an issue',
			},
			{
				name: 'Resolve',
				value: 'resolve',
				description: 'Mark issue as resolved',
				action: 'Mark issue as resolved',
			},
		],
		default: 'getAll',
	},
];

export const issueFields: INodeProperties[] = [
	// Issue ID field
	{
		displayName: 'Issue ID',
		name: 'issueId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['issue'],
				operation: ['get', 'getSessions', 'resolve', 'ignore', 'assign'],
			},
		},
		description: 'The ID of the issue',
	},
	// Assignee for assign operation
	{
		displayName: 'Assignee',
		name: 'assignee',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['issue'],
				operation: ['assign'],
			},
		},
		description: 'Team member to assign the issue to (email or ID)',
	},
	// Return all for getAll and getSessions
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['issue'],
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
				resource: ['issue'],
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
				resource: ['issue'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Assignee',
				name: 'assignee',
				type: 'string',
				default: '',
				description: 'Filter by assigned team member',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter issues occurring before this date',
			},
			{
				displayName: 'Severity',
				name: 'severity',
				type: 'options',
				options: [
					{ name: 'Low', value: 'low' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'High', value: 'high' },
					{ name: 'Critical', value: 'critical' },
				],
				default: '',
				description: 'Filter by issue severity',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter issues occurring after this date',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Open', value: 'open' },
					{ name: 'Resolved', value: 'resolved' },
					{ name: 'Ignored', value: 'ignored' },
				],
				default: '',
				description: 'Filter by issue status',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Error', value: 'error' },
					{ name: 'Rage Click', value: 'rage_click' },
					{ name: 'Slow Network', value: 'slow_network' },
					{ name: 'Dead Click', value: 'dead_click' },
					{ name: 'Form Abandonment', value: 'form_abandonment' },
				],
				default: '',
				description: 'Filter by issue type',
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
				resource: ['issue'],
				operation: ['get', 'getAll'],
			},
		},
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
];

export const issueMethods = {
	async getAll(this: any, i: number): Promise<IDataObject[]> {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const simplify = this.getNodeParameter('simplify', i, true) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		const { simplifyIssue, toIsoString } = await import('../../utils');
		
		const query: IDataObject = {};
		
		if (filters.type) {
			query.type = filters.type;
		}
		if (filters.status) {
			query.status = filters.status;
		}
		if (filters.severity) {
			query.severity = filters.severity;
		}
		if (filters.assignee) {
			query.assignee = filters.assignee;
		}
		if (filters.startDate) {
			query.start_date = toIsoString(filters.startDate as string);
		}
		if (filters.endDate) {
			query.end_date = toIsoString(filters.endDate as string);
		}
		
		let issues: IDataObject[];
		if (returnAll) {
			issues = await logrocketApiRequestAllItems.call(this, 'issues', 'GET', '/issues', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.limit = limit;
			const response = await logrocketApiRequest.call(this, 'GET', '/issues', {}, query);
			issues = (response.issues as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		if (simplify) {
			return issues.map(issue => simplifyIssue(issue));
		}
		return issues;
	},

	async get(this: any, i: number): Promise<IDataObject> {
		const issueId = this.getNodeParameter('issueId', i) as string;
		const simplify = this.getNodeParameter('simplify', i, true) as boolean;
		
		const { logrocketApiRequest } = await import('../../transport');
		const { simplifyIssue } = await import('../../utils');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/issues/${issueId}`);
		const issue = (response.issue as IDataObject) || response;
		
		if (simplify) {
			return simplifyIssue(issue);
		}
		return issue;
	},

	async getSessions(this: any, i: number): Promise<IDataObject[]> {
		const issueId = this.getNodeParameter('issueId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		
		let sessions: IDataObject[];
		if (returnAll) {
			sessions = await logrocketApiRequestAllItems.call(this, 'sessions', 'GET', `/issues/${issueId}/sessions`);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await logrocketApiRequest.call(this, 'GET', `/issues/${issueId}/sessions`, {}, { limit });
			sessions = (response.sessions as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		return sessions;
	},

	async resolve(this: any, i: number): Promise<IDataObject> {
		const issueId = this.getNodeParameter('issueId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'POST', `/issues/${issueId}/resolve`);
		return (response.issue as IDataObject) || response;
	},

	async ignore(this: any, i: number): Promise<IDataObject> {
		const issueId = this.getNodeParameter('issueId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'POST', `/issues/${issueId}/ignore`);
		return (response.issue as IDataObject) || response;
	},

	async assign(this: any, i: number): Promise<IDataObject> {
		const issueId = this.getNodeParameter('issueId', i) as string;
		const assignee = this.getNodeParameter('assignee', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'POST', `/issues/${issueId}/assign`, {
			assignee,
		});
		return (response.issue as IDataObject) || response;
	},
};
