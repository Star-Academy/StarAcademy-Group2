import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
	selector: 'search-edges-form',
	templateUrl: './search-edges-form.component.html',
	styleUrls: [ './search-edges-form.component.scss' ]
})
export class SearchEdgesFormComponent {
	@Input() snackbar: SnackbarComponent;

	@Output() callback = new EventEmitter();

	public clickedOnSearchButton = (form: any) =>
		this.callback.emit(this.createFilters(form));

	private createFilters(form) {
		let filters = {};

		filters['amountFloor'] = form.amountFloor ? form.amountFloor : 0;
		filters['amountCeiling'] = form.amountCeiling
			? form.amountCeiling
			: '999999999999';

		filters['dateFloor'] = form.amountFloor
			? this.parseDate(form.dateFloor)
			: '1900/01/01';

		filters['dateCeiling'] = form.amountFloor
			? this.parseDate(form.dateCeiling)
			: '2100/01/01';

		if (form.transactionId) filters['transactionId'] = form.transactionId;
		if (form.transactionType) filters['type'] = form.transactionType;

		return filters;
	}

	private parseDate = (date: string) => String(date).replace(/-/g, '/');
}
