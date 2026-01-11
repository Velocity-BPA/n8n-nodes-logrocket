/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

import { sessionOperations, sessionFields, sessionMethods } from './actions/session';
import { userOperations, userFields, userMethods } from './actions/user';
import { issueOperations, issueFields, issueMethods } from './actions/issue';
import { errorOperations, errorFields, errorMethods } from './actions/error';
import { eventOperations, eventFields, eventMethods } from './actions/event';
import { highlightOperations, highlightFields, highlightMethods } from './actions/highlight';
import { metricOperations, metricFields, metricMethods } from './actions/metric';
import { funnelOperations, funnelFields, funnelMethods } from './actions/funnel';
import { segmentOperations, segmentFields, segmentMethods } from './actions/segment';
import { alertOperations, alertFields, alertMethods } from './actions/alert';
import { teamOperations, teamFields, teamMethods } from './actions/team';
import { projectOperations, projectFields, projectMethods } from './actions/project';

// Emit licensing notice on load (once)
const licensingNoticeShown = Symbol.for('logrocket.licensingNotice');
if (!(global as any)[licensingNoticeShown]) {
	console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
	(global as any)[licensingNoticeShown] = true;
}

export class LogRocket implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LogRocket',
		name: 'logRocket',
		icon: 'file:logrocket.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the LogRocket API for session replay, error tracking, and product analytics',
		defaults: {
			name: 'LogRocket',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'logrocketApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Alert',
						value: 'alert',
					},
					{
						name: 'Error',
						value: 'error',
					},
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Funnel',
						value: 'funnel',
					},
					{
						name: 'Highlight',
						value: 'highlight',
					},
					{
						name: 'Issue',
						value: 'issue',
					},
					{
						name: 'Metric',
						value: 'metric',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Segment',
						value: 'segment',
					},
					{
						name: 'Session',
						value: 'session',
					},
					{
						name: 'Team',
						value: 'team',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'session',
			},
			// Operations and fields for each resource
			...sessionOperations,
			...sessionFields,
			...userOperations,
			...userFields,
			...issueOperations,
			...issueFields,
			...errorOperations,
			...errorFields,
			...eventOperations,
			...eventFields,
			...highlightOperations,
			...highlightFields,
			...metricOperations,
			...metricFields,
			...funnelOperations,
			...funnelFields,
			...segmentOperations,
			...segmentFields,
			...alertOperations,
			...alertFields,
			...teamOperations,
			...teamFields,
			...projectOperations,
			...projectFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Map resources to their method handlers
		const methodHandlers: Record<string, Record<string, (i: number) => Promise<IDataObject | IDataObject[]>>> = {
			session: sessionMethods,
			user: userMethods,
			issue: issueMethods,
			error: errorMethods,
			event: eventMethods,
			highlight: highlightMethods,
			metric: metricMethods,
			funnel: funnelMethods,
			segment: segmentMethods,
			alert: alertMethods,
			team: teamMethods,
			project: projectMethods,
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const handler = methodHandlers[resource]?.[operation];
				
				if (!handler) {
					throw new Error(`Operation "${operation}" not found for resource "${resource}"`);
				}

				const result = await handler.call(this, i);

				if (Array.isArray(result)) {
					returnData.push(...result.map(item => ({ json: item })));
				} else {
					returnData.push({ json: result });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
