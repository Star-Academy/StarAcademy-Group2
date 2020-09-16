import {
	Component,
	ViewChild,
	ElementRef,
	AfterViewInit,
	Input
} from '@angular/core';
import {
	trigger,
	state,
	style,
	transition,
	animate,
	keyframes
} from '@angular/animations';

import { NodeList } from '../../../dependencies/ogma.min.js';

import { OgmaService } from '../../services/ogma.service';

import { SnackbarComponent } from '../snackbar/snackbar.component';
import { SearchEdgesModalComponent } from '../search-edges-modal/search-edges-modal.component.js';

@Component({
	selector: 'radial-node-menu',
	templateUrl: './radial-node-menu.component.html',
	styleUrls: [ './radial-node-menu.component.scss' ],
	animations: [
		trigger('menuState', [
			state(
				'closed',
				style({
					display: 'none'
				})
			),
			state(
				'open',
				style({
					display: 'block'
				})
			),
			transition(
				'closed => open',
				animate(
					'300ms',
					keyframes([
						style({ display: 'none' }),
						style({ display: 'block' })
					])
				)
			),
			transition(
				'open => closed',
				animate(
					'300ms',
					keyframes([
						style({ display: 'block' }),
						style({ display: 'none' })
					])
				)
			)
		])
	]
})
export class RadialNodeMenuComponent implements AfterViewInit {
	@Input() snackbar: SnackbarComponent;

	@ViewChild('menu') menuElement: ElementRef;
	@ViewChild('searchEdgesModal') searchEdgesModal: SearchEdgesModalComponent;

	menu;
	status: number = 0;

	menuOffset = { x: 0, y: 0 };

	nodes: NodeList;
	location: { x: number; y: number };

	sourceFlag = false;
	targetFlag = false;

	constructor(public ogmaService: OgmaService) {}

	ngAfterViewInit(): void {
		this.menu = this.menuElement.nativeElement;
	}

	get menuStateStatus() {
		switch (this.status) {
			case 0:
				return 'closed';
			case 1:
				return 'open';
		}
	}

	expandMenu(nodes: NodeList, location: { x: number; y: number }) {
		this.nodes = nodes;

		this.location = this.ogmaService.ogma.view.graphToScreenCoordinates(
			location
		);

		this.status = 1;
		this.menu.classList.add('open');
		this.menu.style.left = `${this.location.x + this.menuOffset.x + 40}px`;
		this.menu.style.top = `${this.location.y + this.menuOffset.y + 40}px`;
		this.menu.style.transform = 'scale(2)';
		this.menu.addEventListener('click', (e) => {
			this.close();
		});

		this.setSourceState();
		this.setTargetState();

		return true;
	}

	close() {
		this.status = 0;
		this.menu.classList.remove('open');
		this.menu.style.transform = 'scale(0)';

		return false;
	}

	lockNodes() {
		this.ogmaService.lockNodes(this.nodes);
		this.close();
	}

	unlockNodes() {
		this.ogmaService.unlockNodes(this.nodes);
		this.close();
	}

	expandNodes() {
		this.ogmaService.expandNode(this.nodes.getId());
		this.searchEdgesModal.open(this.nodes);
		this.close();
	}

	deleteNodes() {
		this.ogmaService.removeNode(this.nodes.getId());
		this.close();
	}

	selectAsSource() {
		if (this.nodes.size > 1) {
			this.snackbar.show(
				'فقط یک حساب میتواند به عنوان مبدأ تعیین شود',
				3000
			);
		} else if (this.sourceFlag) {
			this.ogmaService.removeSource();
			this.close();
		} else {
			if (this.targetFlag) {
				this.ogmaService.removeTarget();
			}

			this.ogmaService.setSource(this.nodes.get(0));
			this.close();
		}
	}

	selectAsTarget() {
		if (this.nodes.size > 1) {
			this.snackbar.show(
				'فقط یک حساب میتواند به عنوان مقصد تعیین شود',
				3000
			);
		} else if (this.targetFlag) {
			this.ogmaService.removeTarget();
			this.close();
		} else {
			if (this.sourceFlag) {
				this.ogmaService.removeSource();
			}

			this.ogmaService.setTarget(this.nodes.get(0));
			this.close();
		}
	}

	setSourceFlag() {
		if (
			this.nodes.size === 1 &&
			this.ogmaService.getSourceNode() &&
			this.ogmaService.getSourceNode().getId() ===
				this.nodes.get(0).getId()
		) {
			this.sourceFlag = true;
		} else {
			this.sourceFlag = false;
		}
	}

	setTargetFlag() {
		if (
			this.nodes.size === 1 &&
			this.ogmaService.getTargetNode() &&
			this.ogmaService.getTargetNode().getId() ===
				this.nodes.get(0).getId()
		) {
			this.targetFlag = true;
		} else {
			this.targetFlag = false;
		}
	}

	setSourceState() {
		this.setSourceFlag();
		if (this.sourceFlag) {
			this.deselectSource();
		} else {
			this.sourceButton();
		}
	}

	setTargetState() {
		this.setTargetFlag();
		if (this.targetFlag) {
			this.deselectTarget();
		} else {
			this.targetButton();
		}
	}

	sourceButton() {
		let button = document.getElementById('source-select');
		button.title = 'انتخاب به عنوان مبدأ';
		button.style.background = '#ffb726';
		button.addEventListener('mouseover', (e) => {
			button.style.color = '#ffb726';
			button.style.background = 'white';
		});

		button.addEventListener('mouseleave', (e) => {
			button.style.background = '#ffb726';
			button.style.color = 'white';
		});
	}

	targetButton() {
		let button = document.getElementById('target-select');
		button.title = 'انتخاب به عنوان مقصد';
		button.style.background = '#ffb726';
		button.addEventListener('mouseover', (e) => {
			button.style.color = '#ffb726';
			button.style.background = 'white';
		});

		button.addEventListener('mouseleave', (e) => {
			button.style.background = '#ffb726';
			button.style.color = 'white';
		});
	}

	deselectSource() {
		let button = document.getElementById('source-select');
		button.title = 'لغو انتخاب';
		button.style.background = 'cornflowerblue';
		button.addEventListener('mouseover', (e) => {
			button.style.color = 'cornflowerblue';
			button.style.background = 'white';
		});

		button.addEventListener('mouseleave', (e) => {
			button.style.background = 'cornflowerblue';
			button.style.color = 'white';
		});
	}

	deselectTarget() {
		let button = document.getElementById('target-select');
		button.title = 'لغو انتخاب';
		button.style.background = 'cornflowerblue';
		button.addEventListener('mouseover', (e) => {
			button.style.color = 'cornflowerblue';
			button.style.background = 'white';
		});

		button.addEventListener('mouseleave', (e) => {
			button.style.background = 'cornflowerblue';
			button.style.color = 'white';
		});
	}
}
