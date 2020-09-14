import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { OgmaService } from '../../services/ogma.service';
import {
	trigger,
	state,
	style,
	transition,
	animate,
	keyframes
} from '@angular/animations';

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
	@ViewChild('menu') menuElement: ElementRef;

	menu;
	status: number = 0;

	menuOffset = { x: 0, y: 0 };

	node;
	sourceFlag = false;
	targetFlag = false;

	constructor(private ogmaService: OgmaService) {}

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

	expandMenu(node) {
		this.node = node;

		let pos = this.ogmaService.ogma.view.graphToScreenCoordinates({
			x: node.getAttribute('x'),
			y: node.getAttribute('y')
		});

		this.status = 1;
		this.menu.classList.add('open');
		this.menu.style.left = `${pos.x + this.menuOffset.x + 40}px`;
		this.menu.style.top = `${pos.y + this.menuOffset.y + 40}px`;
		this.menu.style.transform = 'scale(2)';
		this.menu.addEventListener('click', (e) => {
			this.close();
		});

		this.setSourceState();
		this.setTargetState();

		return true;
	}

	changeOnZooming() {
		let pos = this.ogmaService.ogma.view.graphToScreenCoordinates({
			x: this.node.getAttribute('x'),
			y: this.node.getAttribute('y')
		});
		this.menu.style.left = `${pos.x + this.menuOffset.x}px`;
		this.menu.style.top = `${pos.y + this.menuOffset.y}px`;
	}

	close() {
		this.status = 0;
		this.menu.classList.remove('open');
		this.menu.style.transform = 'scale(0)';

		return false;
	}

	lockNode() {
		this.ogmaService.lockNodes(this.node);
		this.close();
	}

	unlockNode() {
		this.ogmaService.unlockNodes(this.node);
		this.close();
	}

	expandNode() {
		this.ogmaService.expandNode(this.node.getId());
		this.close();
	}

	deleteNode() {
		this.ogmaService.removeNode(this.node.getId());
		this.close();
	}

	selectAsSource() {
		if (this.sourceFlag) {
			this.ogmaService.removeSource();
			this.close();
		} else {
			this.ogmaService.setSource(this.node);
			this.close();
		}
	}

	selectAsTarget() {
		if (this.targetFlag) {
			this.ogmaService.removeTarget();
			this.close();
		} else {
			this.ogmaService.setTarget(this.node);
			this.close();
		}
	}

	setSourceFlag() {
		if (
			this.ogmaService.getSourceNode() &&
			this.ogmaService.getSourceNode().getId() === this.node.getId()
		) {
			this.sourceFlag = true;
		} else {
			this.sourceFlag = false;
		}
	}

	setTargetFlag() {
		if (
			this.ogmaService.getTargetNode() &&
			this.ogmaService.getTargetNode().getId() === this.node.getId()
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
		button.title = 'select as source';
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
		button.title = 'select as target';
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
		button.title = 'deselct';
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
		button.title = 'deselct';
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
