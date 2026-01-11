/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LogRocketApi implements ICredentialType {
	name = 'logrocketApi';
	displayName = 'LogRocket API';
	documentationUrl = 'https://docs.logrocket.com/reference/api-overview';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'LogRocket API Access Key. Find it in Settings > General Settings > API Access Key.',
		},
		{
			displayName: 'Application ID',
			name: 'appId',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'org-slug/app-name',
			description: 'LogRocket Application ID in format: org-slug/app-name',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Token {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://api.logrocket.com/v1/orgs/{{$credentials.appId}}',
			url: '/sessions',
			method: 'GET',
			qs: {
				limit: 1,
			},
		},
	};
}
