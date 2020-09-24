import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AccountNode } from '../models/AccountNode';

import options from './options';

@Injectable({
	providedIn: 'root'
})
export class SearchNodesService {
	public constructor(private httpClient: HttpClient) {}

	// TODO: update this after server changed format
	camelize(str) {
		return str
			.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
				return index === 0 ? word.toLowerCase() : word.toUpperCase();
			})
			.replace(/\s+/g, '');
	}

	public search(filters) {
		let body = '{';
		body += `"${this.camelize(filters[0].field)}" : "${filters[0].query}" `;

		for (let i = 1; i < filters.length; i++) {
			body += `,"${this.camelize(filters[i].field)}" : "${filters[i]
				.query}" `;
		}
		body += '}';

		return this.httpClient.post(
			'https://localhost:5001/userQuery/searchNode',
			body,
			options
		);
	}
}
