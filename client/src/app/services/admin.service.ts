import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserAccount } from '../models/UserAccount';
@Injectable({
	providedIn: 'root'
})
export class AdminService {
	users: UserAccount[] = [];
	deleteAccount(user: UserAccount) {
		let param = new HttpParams().set('username', user.username);
		return this.httpClient.delete<
			any
		>('https://localhost:5001/authentication/deleteUser', {
			params: param
		});
	}

	constructor(private httpClient: HttpClient) {}

	public addUser(user: UserAccount) {
		return this.httpClient.post<any>(
			'https://localhost:5001/authentication/register',
			user
		);
	}
	public getUsers() {
		return this.httpClient.get<UserAccount[]>(
			'https://localhost:5001/authentication/getAllUsers'
		);
	}
}
