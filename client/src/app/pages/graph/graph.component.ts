import { OnInit, Component, Input, ViewChild, ElementRef } from '@angular/core';

import { HoverEvent } from '../../../dependencies/ogma.min.js';

import { OgmaService } from '../../services/ogma.service';
import { SearchNodesService } from '../../services/search-nodes.service.js';

import { GraphModalComponent } from '../../components/graph-modal/graph-modal.component.js';
import { RadialNodeMenuComponent } from '../../components/radial-node-menu/radial-node-menu.component.js';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component.js';
import { AccountNode } from 'src/app/models/AccountNode.js';

@Component({
	selector: 'app-graph',
	templateUrl: './graph.component.html',
	styleUrls: [ './graph.component.scss' ]
})
export class GraphComponent implements OnInit {
	@ViewChild('ogmaContainer', { static: true })
	private container;

	@ViewChild('nodesModal') nodesModal: GraphModalComponent;
	@ViewChild('radialComponent') radialComponent: RadialNodeMenuComponent;
	@ViewChild('findPathMenu') findPathMenu: ElementRef;

	@ViewChild('snackbar') snackbar: SnackbarComponent;

	// TODO: Remove
	@Input() currentLayout: string = 'force';

	// TODO: Remove
	layouts: string[] = [ 'force', 'hierarchical' ];

	hoveredContent;
	hoveredPosition: { x: number; y: number };

	devTools: boolean = true;

	constructor(
		public ogmaService: OgmaService,
		private searchService: SearchNodesService
	) {}

	ngOnInit() {
		this.ogmaService.initConfig({
			options: {
				backgroundColor: '#f2f2f2',
				directedEdges: true,
				minimumWidth: '800',
				minimumHeight: '600'
			}
		});

		this.ogmaService.ogma.events.onClick(({ target, button, domEvent }) => {
			this.radialComponent.close();

			if (target && target.isNode) {
				this.hoveredContent = null;

				if (button === 'right')
					if (domEvent.shiftKey)
						this.ogmaService.toggleNodeLockStatus(target);
					else
						this.radialComponent.expandMenu(
							this.ogmaService.ogma
								.getSelectedNodes()
								.concat(target)
								.dedupe(),
							target.getAttributes([ 'x', 'y' ])
						);
				else if (button === 'left' && domEvent.shiftKey)
					this.nodesModal.open(target.getData());
			}
		});

		this.ogmaService.ogma.events.onMouseButtonDown((e) => {
			this.radialComponent.close();
		});

		this.ogmaService.ogma.events.onDoubleClick(({ target, button }) => {
			if (target && target.isNode && button === 'left')
				this.ogmaService.toggleNodeLockStatus(target);
		});

		this.ogmaService.ogma.events.onZoomProgress(() => {
			this.radialComponent.close();
		});

		this.ogmaService.ogma.events.onHover(({ x, y, target }: HoverEvent) => {
			this.hoveredPosition = {
				x,
				y: y + 20
			};

			if (target.isNode) {
				this.hoveredContent = [
					[ 'شعبه', target.getData('branchName') ],
					[ 'شناسه صاحب حساب', target.getData('ownerId') ],
					[
						'نام صاحب حساب',
						target.getData('ownerName') +
							' ' +
							target.getData('ownerFamilyName')
					]
				];
			} else {
				this.hoveredContent = [
					[ 'حجم تراکنش', target.getData('Amount') ]
				];
			}
		});

		this.ogmaService.ogma.events.onUnhover(
			() => (this.hoveredContent = null)
		);
	}

	ngAfterContentInit() {
		this.ogmaService.ogma.setContainer(this.container.nativeElement);
		this.runLayout();
	}

	// TODO: Remove
	async addNode() {
		let results = await this.searchService.search('OwnerName', 'ارژنگ');
		this.clickedOnAddNodeButton({ node: results[0] });

		results = await this.searchService.search('OwnerName', 'دریا');
		this.clickedOnAddNodeButton({ node: results[0] });

		results = await this.searchService.search('OwnerName', 'افسر');
		this.clickedOnAddNodeButton({ node: results[0] });

		this.runLayout();
	}

	runLayout() {
		this.ogmaService.runLayout(this.currentLayout);
	}

	countNodes(): number {
		return this.ogmaService.ogma.getNodes().size;
	}

	clickedOnSearchNodesButton(e) {
		this.nodesModal.open();
	}

	clickedOnAddNodeButton(e) {
		if (e.attributes) this.ogmaService.addNode(e.node, e.attributes);
		else this.ogmaService.addNode(e.node);
	}

	clickedOnExpandButton(e) {
		this.nodesModal.open(null, 4, e.nodeIds);
	}

	clickedOnFindPathButton(e) {
		e.stopPropagation();

		this.ogmaService.findPath(5);
	}

	toggleFindPathMenu(e: Event) {
		this.findPathMenu.nativeElement.classList.toggle('closed');
	}

	lockNodes(nodes) {
		this.ogmaService.lockNodes(nodes);
	}

	unlockNodes(nodes) {
		this.ogmaService.unlockNodes(nodes);
	}

	stopPropagation(e: Event) {
		e.stopPropagation();
	}
}
