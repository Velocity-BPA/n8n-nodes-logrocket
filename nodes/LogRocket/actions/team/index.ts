/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IDataObject } from 'n8n-workflow';

export const teamOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['team'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get team member details',
				action: 'Get team member details',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'List team members',
				action: 'List team members',
			},
			{
				name: 'Invite',
				value: 'invite',
				description: 'Invite team member',
				action: 'Invite team member',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove team member',
				action: 'Remove team member',
			},
			{
				name: 'Update Role',
				value: 'updateRole',
				description: 'Update member role',
				action: 'Update member role',
			},
		],
		default: 'getAll',
	},
];

export const teamFields: INodeProperties[] = [
	// Member ID field
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['get', 'remove', 'updateRole'],
			},
		},
		description: 'The ID of the team member',
	},
	// Email field for invite
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['invite'],
			},
		},
		description: 'Email address of the person to invite',
	},
	// Role field for invite
	{
		displayName: 'Role',
		name: 'role',
		type: 'options',
		options: [
			{ name: 'Admin', value: 'admin' },
			{ name: 'Member', value: 'member' },
			{ name: 'Viewer', value: 'viewer' },
		],
		required: true,
		default: 'member',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['invite'],
			},
		},
		description: 'Role to assign to the new member',
	},
	// New role field for updateRole
	{
		displayName: 'New Role',
		name: 'newRole',
		type: 'options',
		options: [
			{ name: 'Admin', value: 'admin' },
			{ name: 'Member', value: 'member' },
			{ name: 'Viewer', value: 'viewer' },
		],
		required: true,
		default: 'member',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['updateRole'],
			},
		},
		description: 'New role for the team member',
	},
	// Additional fields for invite
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['invite'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Display name for the new member',
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
				resource: ['team'],
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
				resource: ['team'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];

export const teamMethods = {
	async getAll(this: any, i: number): Promise<IDataObject[]> {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		
		const { logrocketApiRequest, logrocketApiRequestAllItems } = await import('../../transport');
		
		let members: IDataObject[];
		if (returnAll) {
			members = await logrocketApiRequestAllItems.call(this, 'members', 'GET', '/team');
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await logrocketApiRequest.call(this, 'GET', '/team', {}, { limit });
			members = (response.members as IDataObject[]) || (response.data as IDataObject[]) || [];
		}
		
		return members;
	},

	async get(this: any, i: number): Promise<IDataObject> {
		const memberId = this.getNodeParameter('memberId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'GET', `/team/${memberId}`);
		return (response.member as IDataObject) || response;
	},

	async invite(this: any, i: number): Promise<IDataObject> {
		const email = this.getNodeParameter('email', i) as string;
		const role = this.getNodeParameter('role', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const body: IDataObject = {
			email,
			role,
		};
		
		if (additionalFields.name) {
			body.name = additionalFields.name;
		}
		
		const response = await logrocketApiRequest.call(this, 'POST', '/team/invite', body);
		return (response.invitation as IDataObject) || response;
	},

	async remove(this: any, i: number): Promise<IDataObject> {
		const memberId = this.getNodeParameter('memberId', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		await logrocketApiRequest.call(this, 'DELETE', `/team/${memberId}`);
		return { success: true, memberId };
	},

	async updateRole(this: any, i: number): Promise<IDataObject> {
		const memberId = this.getNodeParameter('memberId', i) as string;
		const newRole = this.getNodeParameter('newRole', i) as string;
		
		const { logrocketApiRequest } = await import('../../transport');
		
		const response = await logrocketApiRequest.call(this, 'PATCH', `/team/${memberId}/role`, {
			role: newRole,
		});
		return (response.member as IDataObject) || response;
	},
};
