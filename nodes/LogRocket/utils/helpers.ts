/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Simplify session data for cleaner output
 */
export function simplifySession(session: IDataObject, appId: string): IDataObject {
	return {
		id: session.id,
		userId: session.user_id || session.userId,
		email: session.email,
		sessionUrl: `https://app.logrocket.com/${appId}/sessions/${session.id}`,
		startTime: session.start_time || session.startTime,
		endTime: session.end_time || session.endTime,
		duration: session.duration,
		browser: session.browser,
		os: session.os,
		device: session.device,
		url: session.url,
		hasError: session.has_error || session.hasError,
		errorCount: session.error_count || session.errorCount,
		pageCount: session.page_count || session.pageCount,
	};
}

/**
 * Simplify user data for cleaner output
 */
export function simplifyUser(user: IDataObject): IDataObject {
	return {
		id: user.id,
		userId: user.user_id || user.userId,
		email: user.email,
		name: user.name,
		traits: user.traits,
		firstSeen: user.first_seen || user.firstSeen,
		lastSeen: user.last_seen || user.lastSeen,
		sessionCount: user.session_count || user.sessionCount,
	};
}

/**
 * Simplify issue data for cleaner output
 */
export function simplifyIssue(issue: IDataObject): IDataObject {
	return {
		id: issue.id,
		type: issue.type,
		status: issue.status,
		severity: issue.severity,
		title: issue.title,
		message: issue.message,
		firstOccurrence: issue.first_occurrence || issue.firstOccurrence,
		lastOccurrence: issue.last_occurrence || issue.lastOccurrence,
		occurrenceCount: issue.occurrence_count || issue.occurrenceCount,
		affectedUsers: issue.affected_users || issue.affectedUsers,
		assignee: issue.assignee,
	};
}

/**
 * Simplify error data for cleaner output
 */
export function simplifyError(error: IDataObject): IDataObject {
	return {
		id: error.id,
		message: error.message,
		type: error.type,
		url: error.url,
		browser: error.browser,
		os: error.os,
		firstOccurrence: error.first_occurrence || error.firstOccurrence,
		lastOccurrence: error.last_occurrence || error.lastOccurrence,
		occurrenceCount: error.occurrence_count || error.occurrenceCount,
		affectedUsers: error.affected_users || error.affectedUsers,
		resolved: error.resolved,
	};
}

/**
 * Simplify event data for cleaner output
 */
export function simplifyEvent(event: IDataObject): IDataObject {
	return {
		id: event.id,
		name: event.name,
		type: event.type,
		timestamp: event.timestamp,
		properties: event.properties,
		userId: event.user_id || event.userId,
		sessionId: event.session_id || event.sessionId,
	};
}

/**
 * Simplify metric data for cleaner output
 */
export function simplifyMetric(metric: IDataObject): IDataObject {
	return {
		name: metric.name,
		value: metric.value,
		timestamp: metric.timestamp,
		groupBy: metric.group_by || metric.groupBy,
		count: metric.count,
		average: metric.average,
		percentile50: metric.p50,
		percentile95: metric.p95,
		percentile99: metric.p99,
	};
}

/**
 * Convert n8n date to ISO string
 */
export function toIsoString(date: string | number | Date): string {
	if (typeof date === 'number') {
		return new Date(date).toISOString();
	}
	if (typeof date === 'string') {
		return new Date(date).toISOString();
	}
	return date.toISOString();
}

/**
 * Build query parameters for session filtering
 */
export function buildSessionQuery(filters: IDataObject): IDataObject {
	const query: IDataObject = {};

	if (filters.userId) {
		query.user_id = filters.userId;
	}
	if (filters.email) {
		query.email = filters.email;
	}
	if (filters.startDate) {
		query.start_date = toIsoString(filters.startDate as string);
	}
	if (filters.endDate) {
		query.end_date = toIsoString(filters.endDate as string);
	}
	if (filters.hasError !== undefined) {
		query.has_error = filters.hasError;
	}
	if (filters.minDuration) {
		query.min_duration = filters.minDuration;
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
	if (filters.device) {
		query.device = filters.device;
	}
	if (filters.limit) {
		query.limit = filters.limit;
	}

	return query;
}

/**
 * Process execution data to output format
 */
export function processExecutionData(
	items: IDataObject[],
	simplifyFn?: (item: IDataObject, appId?: string) => IDataObject,
	appId?: string,
): INodeExecutionData[] {
	return items.map((item) => ({
		json: simplifyFn ? simplifyFn(item, appId) : item,
	}));
}

/**
 * Validate required parameters
 */
export function validateRequired(params: IDataObject, required: string[]): void {
	for (const param of required) {
		if (!params[param]) {
			throw new Error(`Missing required parameter: ${param}`);
		}
	}
}
