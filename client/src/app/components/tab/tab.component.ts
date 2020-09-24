import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { ThemeService } from '../../services/theme.service';

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

	public hovered: boolean = false;
	public closeHovered: boolean = false;

	constructor(public theme: ThemeService) {}

	ngOnInit(): void {}

	public tabStyle() {
		return this.isActive
			? this.theme.primary.selected
			: this.hovered ? this.theme.primary.hovered : this.theme.primary;
	}

	public closeStyle() {
		if (this.isActive)
			return this.closeHovered
				? this.theme.primary
				: this.theme.primary.selected;

		return this.closeHovered
			? this.theme.primary
			: this.theme.primary.hovered;
	}

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
