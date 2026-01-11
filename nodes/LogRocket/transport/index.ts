/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IRequestOptions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/**
 * Make an authenticated request to the LogRocket API
 */
export async function logrocketApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('logrocketApi');
	const appId = credentials.appId as string;

	const options: IRequestOptions = {
		method,
		uri: `https://api.logrocket.com/v1/orgs/${appId}${endpoint}`,
		headers: {
			Authorization: `Token ${credentials.apiKey}`,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (Object.keys(body).length > 0 && method !== 'GET') {
		options.body = body;
	}

	if (Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		const errorMessage = (error as Error).message || 'Unknown error';
		const errorObject: JsonObject = { message: errorMessage };
		throw new NodeApiError(this.getNode(), errorObject, {
			message: `LogRocket API request failed: ${errorMessage}`,
		});
	}
}

/**
 * Make an authenticated request with pagination support
 */
export async function logrocketApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let responseData: IDataObject;
	let cursor: string | undefined;

	query.limit = query.limit || 100;

	do {
		if (cursor) {
			query.cursor = cursor;
		}

		responseData = await logrocketApiRequest.call(this, method, endpoint, body, query);

		const items = (responseData[propertyName] as IDataObject[]) || 
			(responseData.data as IDataObject[]) || [];
		returnData.push(...items);

		const pagination = responseData.pagination as IDataObject;
		cursor = pagination?.next_cursor as string | undefined;
	} while (cursor);

	return returnData;
}

/**
 * Build a LogRocket session replay URL
 */
export function buildSessionUrl(
	appId: string,
	sessionId: string,
	timestamp?: number,
): string {
	let url = `https://app.logrocket.com/${appId}/sessions/${sessionId}`;
	if (timestamp !== undefined) {
		url += `?t=${timestamp}`;
	}
	return url;
}

/**
 * Format date for LogRocket API
 */
export function formatDateForApi(date: string | Date): string {
	if (typeof date === 'string') {
		return new Date(date).toISOString();
	}
	return date.toISOString();
}

/**
 * Parse LogRocket error response
 */
export function parseErrorMessage(error: IDataObject): string {
	if (error.error && typeof error.error === 'object') {
		const errorObj = error.error as IDataObject;
		return (errorObj.message as string) || (errorObj.code as string) || 'Unknown error';
	}
	return (error.message as string) || 'Unknown error';
}
