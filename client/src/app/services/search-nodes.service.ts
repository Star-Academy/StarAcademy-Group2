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

	// public search(field: string, query: string): Array<AccountNode> {
	// 	let sample = new AccountNode();
	// 	sample.branchName = 'گلوبندک';
	// 	sample.branchTelephone = '55638667';
	// 	sample.ownerId = '1227114110';
	// 	sample.ownerName = 'افسر';
	// 	sample.ownerFamilyName = 'طباطبایی';
	// 	sample.accountType = 'پس‌انداز';
	// 	sample.accountId = '6534454617';
	// 	sample.cardId = '6104335000000190';
	// 	sample.sheba = 'IR120778801496000000198';
	// 	sample.branchAddress = 'تهران-خیابان خیام-بالاتر از چهارراه گلوبندک';

	// 	return [ sample ];
	// }
}
