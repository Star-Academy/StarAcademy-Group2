import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class GraphService {
	constructor(private httpClient: HttpClient) {}

	// public expandRequest(nodeIds, response) {
	//     this.httpClient.post<any>('https://localhost:5001/search/', nodeIds).subscribe((result) => {
	//       response = result;
	//     });
	// }

	public expandRequest(nodeIds) {
		let temp = [
			{
				item1: [
					{
						AccountID: 1,
						OwnerName: null,
						OwnerFamilyName: null,
						BranchName: null,
						OwnerID: '10',
						BranchAdress: null,
						BranchTelephone: null,
						AccountType: null,
						Sheba: null,
						CardID: null
					},
					{
						AccountID: 2,
						OwnerName: null,
						OwnerFamilyName: null,
						BranchName: null,
						OwnerID: '100',
						BranchAdress: null,
						BranchTelephone: null,
						AccountType: null,
						Sheba: null,
						CardID: null
					}
				],
				item2: [
					{
						SourceAcount: 1,
						DestiantionAccount: 2,
						Amount: 0,
						Date: null,
						TransactionID: '20',
						Type: null
					},
					{
						SourceAcount: 2,
						DestiantionAccount: 3,
						Amount: 0,
						Date: null,
						TransactionID: '300',
						Type: null
					},
					{
						SourceAcount: 1,
						DestiantionAccount: 3,
						Amount: 0,
						Date: null,
						TransactionID: '200',
						Type: null
					}
				]
			},
			{
				item1: [
					{
						AccountID: 3,
						OwnerName: null,
						OwnerFamilyName: null,
						BranchName: null,
						OwnerID: '10',
						BranchAdress: null,
						BranchTelephone: null,
						AccountType: null,
						Sheba: null,
						CardID: null
					},
					{
						AccountID: 4,
						OwnerName: null,
						OwnerFamilyName: null,
						BranchName: null,
						OwnerID: '100',
						BranchAdress: null,
						BranchTelephone: null,
						AccountType: null,
						Sheba: null,
						CardID: null
					}
				],
				item2: [
					{
						SourceAcount: 4,
						DestiantionAccount: 4,
						Amount: 0,
						Date: null,
						TransactionID: '250',
						Type: null
					}
				]
			}
		];
		return temp;
	}
}
