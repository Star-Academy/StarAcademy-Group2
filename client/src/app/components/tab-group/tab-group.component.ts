import { EventEmitter, Output, Component, OnInit } from '@angular/core';

@Component({
	selector: 'graph-tab-group',
	templateUrl: './tab-group.component.html',
	styleUrls: [ './tab-group.component.scss' ]
})
export class TabGroupComponent implements OnInit {
	@Output() onTabChange = new EventEmitter();
	@Output() onTabAdd = new EventEmitter();
	@Output() onTabDelete = new EventEmitter();

	public tabs = [ 'first' ];
	public activeTab = 0;

	constructor() {}

	ngOnInit(): void {}

	tabChange(event) {
		this.activeTab = event.index;
		this.onTabChange.emit({ index: event.index });
	}

	deleteTab(event) {
		if (this.tabs.length > 1) {
			this.tabs.splice(event.index, 1);
			if (this.activeTab === event.index) {
				this.activeTab = event.index - 1;
			} else if (this.activeTab > event.index) {
				this.activeTab -= 1;
			}
			if (this.activeTab < 0) {
				this.activeTab = 0;
			}
			this.onTabDelete.emit({ index: event.index });
		}
	}

	clickedOnAddTab(event) {
		if (this.tabs.length < 10) {
			this.tabs.push('گراف جدید');
			this.activeTab = this.tabs.length - 1;
			this.onTabAdd.emit({ index: this.activeTab });
		}
	}

	onChangeName(event) {
		this.tabs[event.index] = event.newName;
	}
}
