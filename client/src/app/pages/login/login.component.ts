import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { UserAccount } from '../../models/UserAccount';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {
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
			.login(new UserAccount(this.user.username, this.user.password))
			.subscribe((data) => {
				localStorage.setItem('token', data.token);
				this.router.navigate([ '/graph' ]);
			});
	}

	public adminLogin() {}
}
