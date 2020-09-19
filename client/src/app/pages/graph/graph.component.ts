import { OnInit, Component, Input, ViewChild, ElementRef } from '@angular/core';

import { HoverEvent } from '../../../dependencies/ogma.min.js';

import { OgmaService } from '../../services/ogma.service';
import { SearchNodesService } from '../../services/search-nodes.service.js';

import { GraphModalComponent } from '../../components/graph-modal/graph-modal.component.js';
import { RadialNodeMenuComponent } from '../../components/radial-node-menu/radial-node-menu.component.js';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component.js';

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
	@ViewChild('pathMaxLength') pathMaxLength: ElementRef;

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

	public ngOnInit() {
		this.ogmaService.initConfig({
			options: {
				backgroundColor: '#f2f2f2',
				directedEdges: true,
				minimumWidth: '800',
				minimumHeight: '600'
			}
		});

		this.setupOgmaEventHandlers();
	}

	public ngAfterContentInit() {
		this.ogmaService.ogma.setContainer(this.container.nativeElement);
	}

	// TODO: Remove
	public addNode() {
		this.searchService
			.search('OwnerName', 'ارژنگ')
			.subscribe((res) => this.clickedOnAddNodeButton({ node: res[0] }));

		this.searchService
			.search('OwnerName', 'دریا')
			.subscribe((res) => this.clickedOnAddNodeButton({ node: res[0] }));

		this.searchService
			.search('OwnerName', 'افسر')
			.subscribe((res) => this.clickedOnAddNodeButton({ node: res[0] }));

		setTimeout(() => this.runLayout(), 500);
	}

	// TODO: use this
	public countNodes = (): number => this.ogmaService.ogma.getNodes().size;

	public clickedOnSearchNodesButton = () => this.nodesModal.open();

	public clickedOnAddNodeButton = ({ node, attributes = null }) =>
		this.ogmaService.addNode(node, attributes);

	public clickedOnExpandButton = ({ nodeIds }) =>
		this.nodesModal.open(null, 4, nodeIds);

	public clickedOnFindPathButton(e: Event) {
		this.ogmaService.findPath(this.pathMaxLength.nativeElement.value);

		// TODO: check if path was found
		this.toggleFindPathMenu();
	}

	public toggleFindPathMenu = () =>
		this.findPathMenu.nativeElement.classList.toggle('closed');

	public lockNodes = (nodes) => this.ogmaService.lockNodes(nodes);
	public unlockNodes = (nodes) => this.ogmaService.unlockNodes(nodes);

	public stopPropagation = (e: Event) => e.stopPropagation();

	private runLayout = () => this.ogmaService.runLayout(this.currentLayout);

	private setupOgmaEventHandlers() {
		this.ogmaService.ogma.events.onClick(({ target, button, domEvent }) => {
			this.radialComponent.close();

			if (target && target.isNode) {
				this.hoveredContent = null;

				if (button === 'right')
					this.radialComponent.expandMenu(
						this.ogmaService.ogma
							.getSelectedNodes()
							.concat(target)
							.dedupe(),
						target.getPosition()
					);
				else if (button === 'left' && domEvent.shiftKey)
					this.nodesModal.open(target.getData());
			}
		});

		this.ogmaService.ogma.events.onDoubleClick(({ target, button }) => {
			if (target && target.isNode && button === 'left')
				this.ogmaService.toggleNodeLockStatus(target);
		});

		this.ogmaService.ogma.events.onMouseButtonDown(() =>
			this.radialComponent.close()
		);

		this.ogmaService.ogma.events.onZoomProgress(() => {
			this.radialComponent.close();
			this.hoveredContent = null;
		});

		this.ogmaService.ogma.events.onHover(({ target }) =>
			this.updateTooltip(target)
		);

		this.ogmaService.ogma.events.onUnhover(
			() => (this.hoveredContent = null)
		);
	}

	private updateTooltip(target) {
		let offset = 0;
		if (target.isNode) offset = target.getAttribute('radius');

		const position = target.getBoundingBox();
		this.hoveredPosition = this.ogmaService.ogma.view.graphToScreenCoordinates(
			{
				x: position.cx,
				y: position.cy - offset
			}
		);

		if (target.isNode) {
			this.hoveredContent = [
				[ 'شعبه', target.getData('BranchName') ],
				[ 'شناسه صاحب حساب', target.getData('OwnerID') ],
				[
					'نام صاحب حساب',
					target.getData('OwnerName') +
						' ' +
						target.getData('OwnerFamilyName')
				]
			];
		} else {
			this.hoveredContent = [
				[ 'حجم تراکنش', target.getData('Amount') ]
			];
		}
	}
}
