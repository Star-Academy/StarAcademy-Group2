import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AccountNode } from '../models/AccountNode';
import { TransactionEdge } from '../models/TransactionEdge';

@Injectable({
	providedIn: 'root'
})
export class GraphService {
	constructor(private httpClient: HttpClient) {}

	public addNode(node: AccountNode) {
		return this.httpClient.post(
			'https://localhost:5001/mapState/addNode',
			node.accountId
		);
	}

	public expandRequest(nodeIds, response) {
		this.httpClient.post('https://localhost:5001/search/', nodeIds);
	}
}
