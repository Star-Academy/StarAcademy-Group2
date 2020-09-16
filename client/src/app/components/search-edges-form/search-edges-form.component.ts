import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
	selector: 'search-edges-form',
	templateUrl: './search-edges-form.component.html',
	styleUrls: [ './search-edges-form.component.scss' ]
})
export class SearchEdgesFormComponent implements OnInit {
	@Input() snackbar: SnackbarComponent;

	@Output() callback = new EventEmitter();

	maxLength: number = 100;

	constructor() {}

	ngOnInit(): void {}

	clickedOnSearchButton(form: any) {
		this.callback.emit(this.createFilter(form));
	}

	createFilter(form) {
		let filter = {
			amountFloor: '',
			amountCeiling: '',
			dateFloor: '',
			dateCeiling: ''
		};

		if (form.amountFloorCheck) filter.amountFloor = form.amountFloor;
		else filter.amountFloor = '0';

		if (form.amountCeilingCheck) filter.amountCeiling = form.amountCeiling;
		else filter.amountCeiling = '9000000000000000000';

		if (form.dateFloorCheck)
			filter.dateFloor = String(form.dateFloor).replace(/-/g, '/');
		else filter.dateFloor = '1900/01/01';

		if (form.dateCeilingCheck)
			filter.dateCeiling = String(form.dateCeiling).replace(/-/g, '/');
		else filter.dateCeiling = '2100/01/01';

		if (form.transactionIdCheck)
			filter['transactionId'] = form.transactionId;

		if (form.transactionTypeCheck) filter['type'] = form.transactionType;

		return filter;
	}

	validateForm(form: any) {
		return null;
	}
}
