import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AccountNode } from '../models/AccountNode';

@Injectable({
	providedIn: 'root'
})
export class SearchNodesService {
	constructor(private httpClient: HttpClient) {}

	public async search(field: string, query: string): Promise<AccountNode[]> {
		let header = new HttpHeaders().set('Content-Type', 'application/json');

		return new Promise<AccountNode[]>((resolve) => {
			this.httpClient
				.post(
					'https://localhost:5001/userQuery/searchNode',
					`{ "${field}" : "${query}" }`,
					{ headers: header }
				)
				.subscribe((result: AccountNode[]) => {
					resolve(result);
				});
		});
	}
}
