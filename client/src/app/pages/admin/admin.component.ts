import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { ThemeService } from '../../services/theme.service';
import { AdminService } from '../../services/admin.service';

import options from '../../services/options';

import { UserAccount } from '../../models/UserAccount';

import { SnackbarComponent } from '../../components/snackbar/snackbar.component';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: [ './admin.component.scss' ]
})
export class AdminComponent implements OnInit {
	@ViewChild('snackbar') snackbar: SnackbarComponent;

	public shaking: boolean;
	private shakingTimeout: number;

	public items: Item[] = [
		new Item('مدیریت کاربران'),
		new Item('تنظیمات'),
		new Item('بارگذاری حساب‌های بانکی'),
		new Item('بارگذاری تراکنش‌های بانکی'),
		new Item('خروج')
	];
	public navSelectedIndex: number = 0;

	public users: UserAccount[] = [];

	public hoveredRowIndex: number = -1;

	public constructor(
		public theme: ThemeService,
		private httpClient: HttpClient,
		private router: Router,
		private adminService: AdminService
	) {}

	public ngOnInit() {
		this.loadUsersDetails();
	}

	public navigate(index) {
		switch (index) {
			case 2:
				document.getElementById('import-accounts').click();
				break;
			case 3:
				document.getElementById('import-transactions').click();
				break;
			case 4:
				this.logout();
				break;
			default:
				this.navSelectedIndex = index;
		}
	}

	public importAccountsCSV(event) {
		event.target.files[0]
			.text()
			.then((content) =>
				this.sendCSV(
					content,
					'https://localhost:5001/ImportResource/importAccounts/'
				)
			);
	}

	public importTransactionsCSV(event) {
		event.target.files[0]
			.text()
			.then((content) =>
				this.sendCSV(
					content,
					'https://localhost:5001/ImportResource/importTransactions'
				)
			);
	}

	public sendCSV(content: string, url: string) {
		// const headers = new HttpHeaders().set('Content-Type', 'text/plain');
		console.log(content);

		this.httpClient.post(url, `${content}`, options).subscribe(
			(_) => {
				this.snackbar.show(
					'درخواست بارگذاری اطلاعات به درستی انجام شد',
					'success'
				);
			},
			(_) =>
				this.snackbar.show(
					'درخواست بارگذاری اطلاعات با خطا مواجه شد',
					'danger'
				)
		);
	}

	public loadUsersDetails() {
		this.adminService
			.getUsers()
			.subscribe((data: UserAccount[]) => (this.users = data));
	}

	public removeAccount(user, index) {
		this.adminService.deleteAccount(user).subscribe(
			(_) => {
				this.snackbar.show(
					'درخواست حذف کاربر به درستی انجام شد',
					'success'
				);

				const index = this.users.indexOf(user);
				this.users.splice(index, 1);
			},
			(_) => {
				this.snackbar.show(
					'درخواست حذف کاربر با خطا مواجه شد',
					'danger'
				);
			}
		);
	}

	public addUserSubmit(form) {
		if (form.username !== '' && form.password !== '') {
			const user = new UserAccount(form.username, form.password, 0);

			this.adminService.addUser(user).subscribe(
				(_) => {
					this.snackbar.show(
						'درخواست افزودن کاربر جدید به درستی انجام شد',
						'success'
					);

					this.users.push(user);

					form.username = '';
					form.password = '';
				},
				(_) => {
					this.invalidFormSubmit(
						'درخواست افزودن کاربر جدید با خطا مواجه شد'
					);
				}
			);
		} else {
			this.invalidFormSubmit(
				'لطفاً ابتدا تمام موارد خواسته‌شده را ثبت کنید'
			);
		}
	}

	public logout() {
		localStorage.removeItem('token');
		this.router.navigate([ '/login' ]);
	}

	public itemStyle(index: number) {
		if (index === this.items.length - 1)
			return this.navSelectedIndex === index
				? this.theme.danger.selected
				: this.items[index].hovered
					? this.theme.danger.hovered
					: this.theme.primary;

		return this.navSelectedIndex === index
			? this.theme.primary.selected
			: this.items[index].hovered
				? this.theme.primary.hovered
				: this.theme.primary;
	}

	public rowStyle(index: number) {
		return this.hoveredRowIndex === index
			? this.theme.light.hovered
			: this.theme.light;
	}

	public userTypeStyle(user: UserAccount) {
		if (user.type === 1) return this.theme.warning;
		return null;
	}

	public shake(duration: number = 500) {
		if (this.shaking) clearTimeout(this.shakingTimeout);

		this.shaking = true;

		this.shakingTimeout = setTimeout(() => {
			this.shaking = false;
		}, duration);
	}

	public invalidFormSubmit(error: string, duration: number = 500) {
		this.snackbar.show(error, 'danger');
		this.shake(duration);
	}
}

class Item {
	public constructor(public title: string, public hovered: boolean = false) {}
}

class Row {
	public constructor(public hovered: boolean = false) {}
}
