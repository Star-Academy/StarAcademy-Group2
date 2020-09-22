import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent {
	constructor(private router: Router) {}

	@Input() items = [];
	@Output() indexEmitter: EventEmitter<number> = new EventEmitter();
	ngOnInit(): void {}
	menuSelected(i: number) {
		this.indexEmitter.emit(i);
	}
	exit() {
		localStorage.removeItem('token');
		this.router.navigate([ '/login' ]);
	}
}
