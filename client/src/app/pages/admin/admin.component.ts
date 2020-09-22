import { Component, OnInit } from '@angular/core';
import options from '../../services/options';
import { HttpClient } from '@angular/common/http';
import { AccountNode } from '../../models/AccountNode';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: [ './admin.component.scss' ]
})
export class AdminComponent implements OnInit {
	items = [
		'بارگذاری اطلاعات حساب',
		'بارگذاری اطلاعات تراکنش',
		'مدیریت کاربران',
		'تنظیمات'
	];

	constructor(private httpClient: HttpClient) {}

	index: number = 0;
	title: string = '';

	ngOnInit(): void {}

	indexEmitted(event) {
		this.index = event;
		console.log(event, this.items[0]);
		this.title = this.items[this.index];
		switch (event) {
			case 0:
				document.getElementById('import-accounts').click();
				break;
			case 1:
				document.getElementById('import-transactions').click();
				break;
		}
	}

	importAccountsCSV(event) {
		event.target.files[0]
			.text()
			.then((content) =>
				this.sendCSV(
					content,
					'https://localhost:5001/ImportResource/importAccounts'
				)
			);
	}

	importTransactionsCSV(event) {
		event.target.files[0]
			.text()
			.then((content) =>
				this.sendCSV(
					content,
					'https://localhost:5001/ImportResource/importTransactions'
				)
			);
	}

	sendCSV(content: string, url: string) {
		this.httpClient.post(url, content, options).subscribe((result) => {
			console.log(result);
		});
	}
}
