import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { UserAccount } from '../../models/UserAccount';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {
	user = {
		username: '',
		password: ''
	};
	admin = {
		username: '',
		password: ''
	};

	public constructor(
		private router: Router,
		private authService: AuthService
	) {}

	changeAccess() {
		document.querySelector('.cont').classList.toggle('s-signup');
	}

	userLogin() {
		this.authService
			.login(new UserAccount(this.user.username, this.user.password))
			.subscribe((data) => {
				localStorage.setItem('token', data.token);
				this.router.navigate([ '/graph' ]);
			});
	}

	adminLogin() {}
}
