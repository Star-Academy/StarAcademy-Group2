import { OnInit, Component, Input, ViewChild, ElementRef } from '@angular/core';

import { ThemeService } from '../../services/theme.service';
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

	public hoveredContent;
	public hoveredPosition: { x: number; y: number };

	public hovered = {
		findPathMenu: false
	};

	public showingSettings: boolean = false;

	public constructor(
		public theme: ThemeService,
		public ogmaService: OgmaService,
		private searchService: SearchNodesService
	) {}

	public ngOnInit() {
		this.ogmaService.initConfig();
		this.ogmaService.restartTabs();
		this.setupOgmaEventHandlers();
	}

	public ngAfterContentInit() {
		this.setOgmaContainer();
	}

	public setOgmaContainer() {
		this.ogmaService.ogma.setContainer(this.container.nativeElement);
	}

	// TODO: Remove
	public addSomeNode() {
		this.searchService
			.search('OwnerName', 'ارژنگ')
			.subscribe((res) => this.clickedOnAddNodeButton({ node: res[0] }));

		this.searchService
			.search('OwnerName', 'دریا')
			.subscribe((res) => this.clickedOnAddNodeButton({ node: res[0] }));

		this.searchService
			.search('OwnerName', 'افسر')
			.subscribe((res) => this.clickedOnAddNodeButton({ node: res[0] }));

		this.searchService
			.search('OwnerName', 'ژیلا')
			.subscribe((res) => this.clickedOnAddNodeButton({ node: res[0] }));

		setTimeout(() => this.runLayout(), 500);
	}

	public clickedOnSearchNodesButton = () => this.nodesModal.open();

	public clickedOnAddNodeButton = ({ node, attributes = null }) =>
		this.ogmaService.addNode(node, attributes);

	public clickedOnExpandButton = ({ nodeIds }) =>
		this.nodesModal.open(null, 4, nodeIds);

	public clickedOnFindPathButton() {
		this.ogmaService.findPath(this.pathMaxLength.nativeElement.value);

		// TODO: check if path was found
		this.toggleFindPathMenu();
		this.runLayout();
	}

	public toggleFindPathMenu = () =>
		this.findPathMenu.nativeElement.classList.toggle('closed');

	public lockNodes = (nodes) => this.ogmaService.lockNodes(nodes);
	public unlockNodes = (nodes) => this.ogmaService.unlockNodes(nodes);

	public toggleEdgesContentType = () =>
		this.ogmaService.toggleEdgesContentType();

	public saveGraph = () => this.ogmaService.saveGraph();
	public loadGraph = () => document.getElementById('upload-file').click();

	public attachGraphFile($event) {
		$event.target.files[0]
			.text()
			.then((content) => this.ogmaService.loadGraph(content));
	}

	dragMove(e) {
		document.getElementById('trash').style.zIndex = '20';
		let draggable = document.getElementById('draggable');
		draggable.style.zIndex = '20';
		draggable.style.left = `${e.position.x}px`;
		draggable.style.top = `${e.position.y}px`;
	}

	dragEnd(e) {
		let trash = document.getElementById('trash');
		trash.style.zIndex = '-1';
		document.getElementById('draggable').style.zIndex = '-1';
		const ogmaCoordinates = this.ogmaService.ogma.view.screenToGraphCoordinates(
			{
				x: e.position.x,
				y: e.position.y
			}
		);
		if (!trash.onmouseover) {
			this.ogmaService.addNode(e.node, ogmaCoordinates);
		}
	}

	onTabChange(event) {
		if (event.index === -1) {
			this.showingSettings = true;
			return;
		}
		this.showingSettings = false;

		this.ogmaService.tabChange(event.index, this.container.nativeElement);
	}

	onTabAdd(event) {
		this.showingSettings = false;

		this.ogmaService.tabAdd(event.index, this.container.nativeElement);
		this.setOgmaContainer();
		this.setupOgmaEventHandlers();
	}

	onTabDelete(event) {
		this.ogmaService.tabDelete(event.index, this.container.nativeElement);
	}

	public toolbarStyle() {
		return {
			...this.theme.light,
			display: this.showingSettings ? 'none' : 'block'
		};
	}

	public settingsStyle() {
		return {
			...this.theme.default,
			display: !this.showingSettings ? 'none' : 'block'
		};
	}

	public stopPropagation = (e: Event) => e.stopPropagation();

	public runLayout = () => this.ogmaService.runLayout();

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
		if (this.radialComponent.state !== 0) return;

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
