import { OnInit, Component, Input, ViewChild } from '@angular/core';

import { NodeId, HoverEvent } from '../../../dependencies/ogma.min.js';

import { OgmaService } from '../../services/ogma.service';

import { SearchNodesModalComponent } from 'src/app/components/search-nodes-modal/search-nodes-modal.component.js';
import { RadialNodeMenuComponent } from 'src/app/components/radial-node-menu/radial-node-menu.component.js';

@Component({
	selector: 'app-graph',
	templateUrl: './graph.component.html',
	styleUrls: [ './graph.component.scss' ]
})
export class GraphComponent implements OnInit {
	@ViewChild('ogmaContainer', { static: true })
	private container;

	@ViewChild('searchNodesModal') searchNodesModal: SearchNodesModalComponent;
	@ViewChild('radialComponent') radialComponent: RadialNodeMenuComponent;

	// TODO: Remove
	@Input() currentLayout: string = 'force';

	// TODO: Remove
	layouts: string[] = [ 'force', 'hierarchical' ];

	devTools: boolean = true;
	isMenuOn = false;

	constructor(private ogmaService: OgmaService) {}

	ngOnInit() {
		this.ogmaService.initConfig({
			options: {
				backgroundColor: '#f2f2f2',
				directedEdges: true,
				minimumWidth: '800',
				minimumHeight: '600'
			}
		});

		this.ogmaService.ogma.events.onClick((e) => {
			this.isMenuOn = this.radialComponent.close();

			let target = e.target;
			if (e.button === 'right' && target && target.isNode)
				this.isMenuOn = this.radialComponent.expandMenu(target);
		});

		this.ogmaService.ogma.events.onZoomProgress((e) => {
			if (this.isMenuOn) {
				this.radialComponent.changeOnZooming();
			}
		});

		this.ogmaService.ogma.events.onHover(({ target }: HoverEvent) => {
			if (target.isNode) {
				target.setAttributes({ outerStroke: { color: 'green' } });
			}
		});

		this.ogmaService.ogma.events.onUnhover(({ target }: HoverEvent) => {
			if (target.isNode) {
				target.setAttributes({ outerStroke: null });
			}
		});
	}

	ngAfterContentInit() {
		this.ogmaService.ogma.setContainer(this.container.nativeElement);
		return this.runLayout();
	}

	// TODO: Remove
	addNode() {
		this.ogmaService.addNode();

		this.isMenuOn = this.radialComponent.close();

		this.runLayout();
	}

	runLayout() {
		this.ogmaService.runLayout(this.currentLayout);
	}

	countNodes(): number {
		return this.ogmaService.ogma.getNodes().size;
	}

	clickedOnSearchNodesButton(e) {
		this.searchNodesModal.open();
	}

	clickedOnAddNodeButton(e) {
		if (e.attributes) this.ogmaService.addNode(e.node, e.attributes);
		else this.ogmaService.addNode(e.node);
	}

	lockNodes(nodes) {
		this.ogmaService.lockNodes(nodes);
	}

	unlockNodes(nodes) {
		this.ogmaService.unlockNodes(nodes);
	}
}
