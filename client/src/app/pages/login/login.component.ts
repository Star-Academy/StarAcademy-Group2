import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

import { UserAccount } from '../../models/UserAccount';

import { SnackbarComponent } from '../../components/snackbar/snackbar.component';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {
	@ViewChild('snackbar') snackbar: SnackbarComponent;

	public status: boolean;

	public user = {
		username: '',
		password: ''
	};

	public admin = {
		username: '',
		password: ''
	};

	public constructor(
		public theme: ThemeService,
		private router: Router,
		private authService: AuthService
	) {}

	public get containerClassName(): string {
		return this.status ? '' : 'right-panel-active';
	}

	public toggleStatus = () => (this.status = !this.status);

	public userLogin() {
		this.authService
			.login(new UserAccount(this.user.username, this.user.password, 0))
			.subscribe(
				(data) => {
					localStorage.setItem('token', data.token);
					this.router.navigate([ '/graph' ]);
				},
				(_) => {
					this.snackbar.show(
						'درخواست ورود با خطا مواجه شد',
						'danger'
					);
				}
			);
	}

	public adminLogin() {
		this.authService
			.login(new UserAccount(this.admin.username, this.admin.password, 1))
			.subscribe((data) => {
				localStorage.setItem('token', data.token);
				this.router.navigate([ '/admin' ]);
			});
	}
}
