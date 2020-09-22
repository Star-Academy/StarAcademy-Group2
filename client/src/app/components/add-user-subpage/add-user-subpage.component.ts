import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../services/admin.service';

import { UserAccount } from '../../models/UserAccount';

@Component({
	selector: 'add-user-subpage',
	templateUrl: './add-user-subpage.component.html',
	styleUrls: [ './add-user-subpage.component.scss' ]
})
export class AddUserSubpageComponent implements OnInit {
	constructor(private adminService: AdminService) {}

	users = [];
	ngOnInit(): void {
		this.showUsersDetails();
	}
	showUsersDetails() {
		this.adminService.getUsers().subscribe((data) => (this.users = data));
	}

	removeAccount(user) {
		this.adminService
			.deleteAccount(user)
			.subscribe(() => this.showUsersDetails());
	}
	addUserSubmit(form) {
		if (form.username !== '' && form.password !== '' && form.type !== '') {
			this.adminService
				.addUser(
					new UserAccount(
						form.username,
						form.password,
						form.type == 'admin' ? 1 : 0
					)
				)
				.subscribe(() => {
					this.showUsersDetails();
				});
		}
	}
}
