import { getReasonPhrase } from 'http-status-codes';

import { jsonResponse } from '../../types';

export function buildResponse(statusCode: number, message: string, data?: any) {
	let finalData;
	if (data) {
		if (Array.isArray(data)) {
			if (data.length > 0) {
				finalData = data;
			}
		} else {
			finalData = [data];
		}
	}

	let responseJson: jsonResponse = {
		statusCode,
		statusText: getReasonPhrase(statusCode),
		message,
		data: finalData,
	};

	return responseJson;
}

export function buildError(
	statusCode: number,
	message: string,
	errorObj: unknown
) {
	let error = errorObj as Error;
	let responseJson: jsonResponse = {
		statusCode,
		statusText: getReasonPhrase(statusCode),
		message,
		error: {
			errorMessage: error.message ? error.message : '',
		},
	};

	if (process.env.NODE_ENV === 'DEVELOPMENT') {
		responseJson.error.stackTrace = error.stack;
	}

	return responseJson;
}
