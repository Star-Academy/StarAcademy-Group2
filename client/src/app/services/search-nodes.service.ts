import { Injectable } from '@angular/core';
import { AccountNode } from '../models/AccountNode';

@Injectable({
	providedIn: 'root'
})
export class SearchNodesService {
	constructor() {}

	public search(query: string): Array<AccountNode> {
		let sampleAccount = new AccountNode();
		sampleAccount.ownerName = 'mahdi';
		sampleAccount.accountId = 12334;
		return [ sampleAccount ];
	}
}
