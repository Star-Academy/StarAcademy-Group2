import {
	Component,
	ViewChild,
	Input,
	EventEmitter,
	Output
} from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service.js';

import { NodeList } from '../../../dependencies/ogma.min.js';

import { OgmaService } from '../../services/ogma.service';

import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
	selector: 'radial-node-menu',
	templateUrl: './radial-node-menu.component.html',
	styleUrls: [ './radial-node-menu.component.scss' ]
})
export class RadialNodeMenuComponent {
	@Input() snackbar: SnackbarComponent;

	@Output() expandCallback = new EventEmitter();

	public menu: {
		class: string;
		left: number;
		top: number;
	};
	public items: Item[];
	public state: number;

	private nodes: NodeList;
	private location: { x: number; y: number };
	private menuOffset: { x: number; y: number };
	private sourceFlag: boolean;
	private targetFlag: boolean;

	public constructor(
		public theme: ThemeService,
		public ogmaService: OgmaService
	) {
		this.menu = {
			class: '',
			left: 0,
			top: 0
		};

		this.setState(0);
		this.menuOffset = { x: 40, y: 40 };

		this.items = [
			new Item('بسط دادن', 'expand', () => this.expandNodes()),
			new Item('حذف', 'garbageBin', () => this.deleteNodes()),
			new Item('قفل‌کردن', 'lock', () => this.lockNodes()),
			new Item('بازکردن قفل', 'unlock', () => this.unlockNodes()),
			new Item('', 'dollar', () => this.selectAsSource()),
			new Item('', 'shirt', () => this.selectAsTarget())
		];
	}

	private setState(state: number) {
		this.state = state;
		this.menu.class = state === 1 ? 'open' : '';
	}

	public expandMenu(nodes: NodeList, location: { x: number; y: number }) {
		this.setState(1);
		this.nodes = nodes;
		this.location = this.ogmaService.ogma.view.graphToScreenCoordinates(
			location
		);

		this.menu = {
			...this.menu,
			left: (this.location.x + this.menuOffset.x) | 0,
			top: (this.location.y + this.menuOffset.y) | 0
		};

		this.setSourceState();
		this.setTargetState();
	}

	public close = () => this.setState(0);
	public lockNodes = () => this.ogmaService.lockNodes(this.nodes);
	public unlockNodes = () => this.ogmaService.unlockNodes(this.nodes);
	public deleteNodes = () => this.ogmaService.removeNode(this.nodes.getId());

	public expandNodes = () =>
		this.expandCallback.emit({ nodeIds: this.nodes.getId() });

	public selectAsSource() {
		if (this.nodes.size > 1) {
			this.snackbar.show('فقط یک حساب میتواند به عنوان مبدأ تعیین شود');
		} else if (this.sourceFlag) {
			this.ogmaService.removeSource();
		} else {
			if (this.targetFlag) this.ogmaService.removeTarget();
			this.ogmaService.setSource(this.nodes.get(0));
		}
	}

	public selectAsTarget() {
		if (this.nodes.size > 1) {
			this.snackbar.show('فقط یک حساب میتواند به عنوان مقصد تعیین شود');
		} else if (this.targetFlag) {
			this.ogmaService.removeTarget();
		} else {
			if (this.sourceFlag) this.ogmaService.removeSource();
			this.ogmaService.setTarget(this.nodes.get(0));
		}
	}

	private setSourceState() {
		this.setSourceFlag();

		if (!this.sourceFlag) {
			this.items[4].title = 'انتخاب به عنوان مبدأ';
			this.items[4].active = false;
		} else {
			this.items[4].title = 'لغو انتخاب';
			this.items[4].active = true;
		}
	}

	private setTargetState() {
		this.setTargetFlag();

		if (!this.targetFlag) {
			this.items[5].title = 'انتخاب به عنوان مقصد';
			this.items[5].active = false;
		} else {
			this.items[5].title = 'لغو انتخاب';
			this.items[5].active = true;
		}
	}

	private setSourceFlag() {
		this.sourceFlag =
			this.nodes.size === 1 &&
			this.ogmaService.getSourceNode() &&
			this.ogmaService.getSourceNode().getId() ===
				this.nodes.get(0).getId();
	}

	private setTargetFlag() {
		this.targetFlag =
			this.nodes.size === 1 &&
			this.ogmaService.getTargetNode() &&
			this.ogmaService.getTargetNode().getId() ===
				this.nodes.get(0).getId();
	}
}

class Item {
	public constructor(
		public title: any,
		public icon: string,
		public callback: any,
		public active: boolean = false,
		public hovered: boolean = false
	) {}
}
