import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AccountNode } from '../models/AccountNode';

@Injectable({
	providedIn: 'root'
})
export class SearchNodesService {
	constructor(private httpClient: HttpClient) {}

	camelize(str) {
		return str
			.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
				return index === 0 ? word.toLowerCase() : word.toUpperCase();
			})
			.replace(/\s+/g, '');
	}

	public async search(field: string, query: string): Promise<AccountNode[]> {
		console.log(field, query);
		let header = new HttpHeaders().set('Content-Type', 'application/json');

		return new Promise<AccountNode[]>((resolve) => {
			this.httpClient
				.post(
					'https://localhost:5001/userQuery/searchNode',
					`{ "${this.camelize(field)}" : "${query}" }`,
					{ headers: header }
				)
				.subscribe((result: AccountNode[]) => {
					console.log(result);

					resolve(result);
				});
		});
	}
}
