/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get project details',
				action: 'Get project details',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'List projects/apps',
				action: 'List projects',
			},
			{
				name: 'Get SDK Config',
				value: 'getSDKConfig',
				description: 'Get SDK configuration',
				action: 'Get SDK configuration',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update project settings',
				action: 'Update project settings',
			},
		],
		default: 'getAll',
	},
];

export const projectFields: INodeProperties[] = [
	// Project ID field
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['get', 'update', 'getSDKConfig'],
			},
		},
		description: 'The ID of the project/app',
	},
	// Return all for getAll
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
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
				resource: ['project'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the project',
			},
			{
				displayName: 'Privacy Settings',
				name: 'privacySettings',
				type: 'collection',
				placeholder: 'Add Privacy Setting',
				default: {},
				options: [
					{
						displayName: 'Input Sanitization',
						name: 'inputSanitization',
						type: 'options',
						options: [
							{ name: 'None', value: 'none' },
							{ name: 'Moderate', value: 'moderate' },
							{ name: 'Strict', value: 'strict' },
						],
						default: 'moderate',
						description: 'Level of input field sanitization',
					},
					{
						displayName: 'Network Sanitization',
						name: 'networkSanitization',
						type: 'boolean',
						default: true,
						description: 'Whether to sanitize network request/response bodies',
					},
					{
						displayName: 'Session Recording',
						name: 'sessionRecording',
						type: 'boolean',
						default: true,
						description: 'Whether session recording is enabled',
					},
				],
				description: 'Privacy and sanitization settings',
			},
			{
				displayName: 'Settings',
				name: 'settings',
				type: 'collection',
				placeholder: 'Add Setting',
				default: {},
				options: [
					{
						displayName: 'Console Log Recording',
						name: 'consoleLogRecording',
						type: 'boolean',
						default: true,
						description: 'Whether to record console logs',
					},
					{
						displayName: 'Network Recording',
						name: 'networkRecording',
						type: 'boolean',
						default: true,
						description: 'Whether to record network requests',
					},
					{
						displayName: 'Performance Monitoring',
						name: 'performanceMonitoring',
						type: 'boolean',
						default: true,
						description: 'Whether to enable performance monitoring',
					},
				],
				description: 'Project settings',
			},
		],
	},
];

export const projectMethods = {
	async getAll(this: any, i: number): Promise<IDataObject[]> {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		
		let projects: IDataObject[];
		if (returnAll) {
			projects = await logrocketApiRequestAllItems.call(this, 'projects', 'GET', '/projects');
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await logrocketApiRequest.call(this, 'GET', '/projects', {}, { limit });
			projects = (response.projects as IDataObject[]) || (response.apps as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		return projects;
	},

	async get(this: any, i: number): Promise<IDataObject> {
		const projectId = this.getNodeParameter('projectId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/projects/${projectId}`);
		return (response.project as IDataObject) || (response.app as IDataObject) || response;
	},

	async update(this: any, i: number): Promise<IDataObject> {
		const projectId = this.getNodeParameter('projectId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const body: IDataObject = {};
		
		if (updateFields.name) {
			body.name = updateFields.name;
		}
		
		if (updateFields.settings) {
			body.settings = updateFields.settings;
		}
		
		if (updateFields.privacySettings) {
			body.privacy_settings = updateFields.privacySettings;
		}
		
		const response = await logrocketApiRequest.call(this, 'PATCH', `/projects/${projectId}`, body);
		return (response.project as IDataObject) || (response.app as IDataObject) || response;
	},

	async getSDKConfig(this: any, i: number): Promise<IDataObject> {
		const projectId = this.getNodeParameter('projectId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/projects/${projectId}/sdk-config`);
		return (response.config as IDataObject) || response;
	},
};
