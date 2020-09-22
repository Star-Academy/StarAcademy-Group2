import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'graph-tab',
	templateUrl: './tab.component.html',
	styleUrls: [ './tab.component.scss' ]
})
export class TabComponent implements OnInit {
	@Input() label;
	@Input() index;
	@Input() isActive: boolean;

	@Output() onClickedCallback = new EventEmitter();
	@Output() onClosedCallback = new EventEmitter();
	@Output() onChangeNameCallback = new EventEmitter();

	constructor() {}

	ngOnInit(): void {}

	clickedOnCloseTab(event) {
		this.onClosedCallback.emit({ index: this.index });
	}

	clickOnTab(event) {
		if (!this.isActive) {
			this.onClickedCallback.emit({ index: this.index });
		}
	}

	onDoubleClick(event) {
		const temp = prompt('rename', `${this.label}`);
		if (temp && temp.length > 0) {
			this.onChangeNameCallback.emit({
				index: this.index,
				newName: temp
			});
		}
	}
}
