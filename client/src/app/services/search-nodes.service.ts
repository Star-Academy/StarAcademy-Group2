import { Injectable } from '@angular/core';
import { AccountNode } from '../models/AccountNode';

@Injectable({
	providedIn: 'root'
})
export class SearchNodesService {
	constructor() {}

	public search(field: string, query: string): Array<AccountNode> {
		let sample = new AccountNode();
		sample.branchName = 'گلوبندک';
		sample.branchTelephone = '55638667';
		sample.ownerId = '1227114110';
		sample.ownerName = 'افسر';
		sample.ownerFamilyName = 'طباطبایی';
		sample.accountType = 'پس‌انداز';
		sample.accountId = '6534454617';
		sample.cardId = '6104335000000190';
		sample.sheba = 'IR120778801496000000198';
		sample.branchAddress = 'تهران-خیابان خیام-بالاتر از چهارراه گلوبندک';

		return [ sample ];
	}
}
