import { keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { GraphComponent } from 'src/app/pages/graph/graph.component';
import { OgmaService } from 'src/app/services/ogma.service';

@Component({
	selector: 'radial-node-menu',
	templateUrl: './radial-node-menu.component.html',
	styleUrls: [ './radial-node-menu.component.scss' ]
})
export class RadialNodeMenuComponent implements OnInit {
	public node;
	private sourceFlag = true;
	private targetFlag = true;

	constructor(private ogmaService: OgmaService) {}

	ngOnInit(): void {}

	public expandMenu(node, x, y) {
		this.node = node;
		let menu = document.getElementById('menu');
		menu.style.left = `${x}px`;
		menu.style.top = `${y}px`;
		menu.style.transform = 'scale(2)';
	}

	public close() {
		let menu = document.getElementById('menu');
		menu.style.transform = 'scale(0)';
	}

	public lockNode() {
		this.ogmaService.lockNodes(this.node);
		this.close();
	}

	public unlockNode() {
		this.ogmaService.unlockNodes(this.node);
		this.close();
	}

	public expandNode() {
		this.ogmaService.expandNode(this.node.getId());
		this.close();
	}

	public deleteNode() {
		this.ogmaService.deleteNode(this.node.getId());
		this.close();
	}

	public selectAsSource() {
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

	public selectAsTarget() {
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

	private changeButtonToDeselect(id) {
		let button = document.getElementById(id);
		button.title = 'deselct';
		//button.setAttribute(key) svg-icon shpud be changed
	}

	private changeButtonToOriginal(id, title) {
		let button = document.getElementById(id);
		button.title = title;
		//button.setAttribute(key) svg-icon shpud be changed
	}
}
