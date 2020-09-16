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
			`"${node.accountId}"`,
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
