import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AccountNode } from '../models/AccountNode';
import { TransactionEdge } from '../models/TransactionEdge';

@Injectable({
	providedIn: 'root'
})
export class GraphService {
	constructor(private httpClient: HttpClient) {}

	public addNode(node: AccountNode) {
		let header = new HttpHeaders().set('Content-Type', 'application/json');

		return this.httpClient.post(
			'https://localhost:5001/mapState/addNode',
			`"${node.AccountID}"`,
			{ headers: header }
		);
	}

	public findPath(source, target, pathLength) {
		pathLength = Math.max(1, Math.min(5, pathLength));

		let request = `sourceId=${source}&destinationId=${target}&maxLength=${pathLength}`;
		return this.httpClient.get(
			`https://localhost:5001/UserQuery/FindAllPath?${request}`,
			{ responseType: 'json' }
		);
	}

	public findMaxFlow(source, target) {
		let header = new HttpHeaders().set('Content-Type', 'application/json');
		return this.httpClient.post(
			'https://localhost:5001/UserQuery/flow',
			{ item1: source, item2: target },
			{ headers: header }
		);
	}

	public expandRequest(payload) {
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/json');
		return this.httpClient.post(
			'https://localhost:5001/UserQuery/expand',
			payload,
			{ responseType: 'json', headers: header }
		);
	}

	public deleteNode(nodeId) {
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/json');
		this.httpClient
			.post('https://localhost:5001/MapState/deleteNode', `"${nodeId}"`, {
				headers: header
			})
			.subscribe();
	}
}
