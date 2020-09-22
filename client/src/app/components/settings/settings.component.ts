import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: [ './settings.component.scss' ]
})
export class SettingsComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}

	changeBackground(element) {
		document.getElementById(element.id.substr(11)).style.backgroundColor =
			element.value;
	}

	changeForeground(element) {
		document.getElementById(element.id.substr(11)).style.color =
			element.value;
	}

	//TODO remove
	showColors() {
		let btn = [
			'default',
			'primary',
			'secondary',
			'success',
			'danger',
			'warning',
			'info',
			'light',
			'dark',
			'label',
			'disabled'
		];
		for (let item of btn) {
			console.log(
				item +
					' background: ' +
					document.getElementById(item).style.backgroundColor +
					'\nforeground: ' +
					document.getElementById(item).style.color
			);
		}
	}
}
