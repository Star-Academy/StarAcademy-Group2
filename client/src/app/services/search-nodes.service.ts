import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AccountNode } from '../models/AccountNode';

import options from './options';

@Injectable({
	providedIn: 'root'
})
export class SearchNodesService {
	constructor(private httpClient: HttpClient) {}

	// TODO: update this after server changed format
	camelize(str) {
		return str
			.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
				return index === 0 ? word.toLowerCase() : word.toUpperCase();
			})
			.replace(/\s+/g, '');
	}

	public search(field: string, query: string) {
		return this.httpClient.post(
			'https://localhost:5001/userQuery/searchNode',
			`{ "${this.camelize(field)}" : "${query}" }`,
			options
		);
	}
}
