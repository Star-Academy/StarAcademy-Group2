import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AccountNode } from '../models/AccountNode';

import options from './options';

@Injectable({
	providedIn: 'root'
})
export class GraphService {
	constructor(private httpClient: HttpClient) {}

	public addNode(node: AccountNode) {
		return this.httpClient.post(
			'https://localhost:5001/mapState/addNode',
			`"${node.AccountID}"`,
			options
		);
	}

	public expand(payload) {
		return this.httpClient.post(
			'https://localhost:5001/UserQuery/expand',
			payload,
			options
		);
	}

	public deleteNode(nodeId) {
		return this.httpClient.post(
			'https://localhost:5001/MapState/deleteNode',
			`"${nodeId}"`,
			options
		);
	}

	public findPath(sourceId, destinationId, maxLength) {
		maxLength = Math.max(1, Math.min(5, maxLength));

		return this.httpClient.get(
			'https://localhost:5001/UserQuery/FindAllPath',
			{
				params: {
					sourceId,
					destinationId,
					maxLength
				}
			}
		);
	}

	public findMaxFlow(source, target) {
		return this.httpClient.post(
			'https://localhost:5001/UserQuery/flow',
			{ item1: source, item2: target },
			options
		);
	}
}
