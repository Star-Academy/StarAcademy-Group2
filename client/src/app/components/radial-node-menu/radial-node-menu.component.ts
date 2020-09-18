import {
	Component,
	ViewChild,
	Input,
	EventEmitter,
	Output
} from '@angular/core';

import { NodeList } from '../../../dependencies/ogma.min.js';

import { OgmaService } from '../../services/ogma.service';

import { SnackbarComponent } from '../snackbar/snackbar.component';

import { Animations } from './animations';

@Component({
	selector: 'radial-node-menu',
	templateUrl: './radial-node-menu.component.html',
	styleUrls: [ './radial-node-menu.component.scss' ],
	animations: Animations
})
export class RadialNodeMenuComponent {
	@Input() snackbar: SnackbarComponent;

	@Output() expandCallback = new EventEmitter();

	public menu: {
		class: string;
		left: number;
		top: number;
	};
	public sourceSelectionButton: { class: string; title: string };
	public targetSelectionButton: { class: string; title: string };

	private state: number;
	private nodes: NodeList;
	private location: { x: number; y: number };
	private menuOffset: { x: number; y: number };
	private sourceFlag: boolean;
	private targetFlag: boolean;

	public constructor(public ogmaService: OgmaService) {
		this.menu = {
			class: '',
			left: 0,
			top: 0
		};

		this.setState(0);
		this.menuOffset = { x: 40, y: 40 };

		this.sourceSelectionButton = { class: '', title: '' };
		this.targetSelectionButton = { class: '', title: '' };
	}

	public get menuStateStatus() {
		return this.state === 0 ? 'closed' : 'open ';
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

		if (!this.sourceFlag)
			this.sourceSelectionButton = {
				class: '',
				title: 'انتخاب به عنوان مبدأ'
			};
		else {
			this.sourceSelectionButton = {
				class: 'active',
				title: 'لغو انتخاب'
			};
		}
	}

	private setTargetState() {
		this.setTargetFlag();

		if (!this.targetFlag)
			this.targetSelectionButton = {
				class: '',
				title: 'انتخاب به عنوان مقصد'
			};
		else {
			this.targetSelectionButton = {
				class: 'active',
				title: 'لغو انتخاب'
			};
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
