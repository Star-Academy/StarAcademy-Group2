import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { UserAccount } from '../models/UserAccount';

import options from './options';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	public constructor(private httpClient: HttpClient, private route: Router) {}

	public isLoggedIn: boolean = false;

	public login(user: UserAccount) {
		return this.httpClient.post<any>(
			'https://localhost:5001/authentication/login',
			user,
			options
		);
	}

	public loggedInUser = () =>
		this.httpClient
			.get<any>('https://localhost:5001/authentication/isSimpleUser')
			.pipe(
				map((val) => {
					if (val.message == 'true') return true;
					this.route.navigate([ '/login' ]);
					return false;
				}),
				catchError((e) => {
					this.route.navigate([ '/login' ]);
					return of(false);
				})
			);

	public loggedInAdmin = () =>
		this.httpClient
			.get<any>('https://localhost:5001/authentication/isAdmin')
			.pipe(
				map((response) => {
					if (response.message == 'true') return true;
					this.route.navigate([ '/login' ]);
					return false;
				}),
				catchError((e) => {
					this.route.navigate([ '/login' ]);
					return of(false);
				})
			);

	public getToken = () => localStorage.getItem('token');
}
