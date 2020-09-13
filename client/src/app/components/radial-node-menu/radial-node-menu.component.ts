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
	sourceFlag = true;
	targetFlag = true;

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
		this.menu.style.left = `${pos.x + this.menuOffset.x}px`;
		this.menu.style.top = `${pos.y + this.menuOffset.y}px`;
		this.menu.style.transform = 'scale(2)';

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
		this.ogmaService.deleteNode(this.node.getId());
		this.close();
	}

	selectAsSource() {
		if (this.sourceFlag) {
			this.changeButtonToDeselect('source-select');
			this.ogmaService.setSource(this.node);
			this.sourceFlag = false;
		} else {
			this.changeButtonToOriginal('source-select', 'select as source');
			this.ogmaService.removeSource();
			this.sourceFlag = true;
		}
		this.close();
	}

	selectAsTarget() {
		if (this.targetFlag) {
			this.changeButtonToDeselect('target-select');
			this.ogmaService.setTarget(this.node);
			this.targetFlag = false;
		} else {
			this.changeButtonToOriginal('target-select', 'target as source');
			this.ogmaService.removeTarget();
			this.targetFlag = true;
		}
		this.close();
	}

	changeButtonToDeselect(id) {
		let button = document.getElementById(id);
		button.title = 'deselct';
		//button.setAttribute(key) svg-icon shpud be changed
	}

	changeButtonToOriginal(id, title) {
		let button = document.getElementById(id);
		button.title = title;
		//button.setAttribute(key) svg-icon shpud be changed
	}
}
