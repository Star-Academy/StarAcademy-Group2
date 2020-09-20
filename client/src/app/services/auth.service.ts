import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserAccount } from '../models/UserAccount';

import options from './options';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	public constructor(private httpClient: HttpClient) {}

	public isLoggedIn: boolean = false;

	public login(user: UserAccount) {
		return this.httpClient.post<any>(
			'https://localhost:5001/authentication/login',
			user,
			options
		);
	}

	public loggedIn = () => !!localStorage.getItem('token');
	public getToken = () => localStorage.getItem('token');
}
