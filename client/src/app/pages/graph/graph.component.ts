import { OnInit, Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

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

	private copiedNodes = [];
	private copiedEdges = [];

	public constructor(
		public theme: ThemeService,
		private router: Router,
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
			.search([ { field: 'OwnerName', query: 'ارژنگ' } ])
			.subscribe((res) => this.clickedOnAddNodeButton({ node: res[0] }));

		this.searchService
			.search([ { field: 'OwnerName', query: 'دریا' } ])
			.subscribe((res) => this.clickedOnAddNodeButton({ node: res[0] }));

		this.searchService
			.search([ { field: 'OwnerName', query: 'افسر' } ])
			.subscribe((res) => this.clickedOnAddNodeButton({ node: res[0] }));

		this.searchService
			.search([ { field: 'OwnerName', query: 'ژیلا' } ])
			.subscribe((res) => this.clickedOnAddNodeButton({ node: res[0] }));

		this.searchService
			.search([
				{
					field: 'AccountID',
					query: '8000000281'
				}
			])
			.subscribe((res) => {
				this.clickedOnAddNodeButton({
					node: res[0]
				});
			});

		setTimeout(() => this.runLayout(), 500);

		// this.searchService
		// 	.search([ { field: 'OwnerName', query: 'ارژنگ' } ])
		// 	.subscribe((res) => {
		// 		this.clickedOnAddNodeButton({ node: res[0] });

		// 		this.searchService
		// 			.search([ { field: 'OwnerName', query: 'دریا' } ])
		// 			.subscribe((res) => {
		// 				this.clickedOnAddNodeButton({ node: res[0] });

		// 				this.searchService
		// 					.search([ { field: 'OwnerName', query: 'افسر' } ])
		// 					.subscribe((res) => {
		// 						this.clickedOnAddNodeButton({ node: res[0] });

		// 						this.searchService
		// 							.search([
		// 								{ field: 'OwnerName', query: 'ژیلا' }
		// 							])
		// 							.subscribe((res) => {
		// 								this.clickedOnAddNodeButton({
		// 									node: res[0]
		// 								});

		// 								this.searchService
		// 									.search([
		// 										{
		// 											field: 'AccountID',
		// 											query: '8000000281'
		// 										}
		// 									])
		// 									.subscribe((res) => {
		// 										this.clickedOnAddNodeButton({
		// 											node: res[0]
		// 										});

		// 										this.runLayout();
		// 									});
		// 							});
		// 					});
		// 			});
		// 	});
	}

	public clickedOnSearchNodesButton = () => this.nodesModal.open();

	public clickedOnAddNodeButton = ({ node, attributes = null }) =>
		this.ogmaService.addNode(node, attributes);

	public clickedOnExpandButton = ({ nodeIds }) =>
		this.nodesModal.open(null, 4, nodeIds);

	public clickedOnFindPathButton() {
		const error = this.ogmaService.findPath(
			this.pathMaxLength.nativeElement.value,
			this.snackbar
		);

		if (error) {
			this.snackbar.show(error, 'danger');
			return;
		}

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
		if (event.index === -2) {
			localStorage.removeItem('token');
			this.router.navigate([ '/login' ]);
			return;
		}

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
			display: this.showingSettings ? 'none' : 'grid'
		};
	}

	public settingsStyle() {
		return {
			...this.theme.default,
			display: this.showingSettings ? 'block' : 'none'
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

		this.ogmaService.ogma.events.onDragStart(() => {
			this.hoveredContent = null;
			this.setRectangleSelected();
		});

		this.ogmaService.ogma.events.onKeyPress(46, () =>
			this.ogmaService.removeNode(
				this.ogmaService.ogma.getSelectedNodes()
			)
		);

		this.ogmaService.ogma.events.onKeyPress('shift c', () =>
			this.copyNodesAndEdges()
		);

		this.ogmaService.ogma.events.onKeyPress('shift v', () =>
			this.pasteNodesAndEdges()
		);

		this.ogmaService.ogma.events.onKeyPress('shift l', () =>
			this.ogmaService.lockNodes(this.ogmaService.ogma.getSelectedNodes())
		);

		this.ogmaService.ogma.events.onKeyPress('shift u', () =>
			this.ogmaService.unlockNodes(
				this.ogmaService.ogma.getSelectedNodes()
			)
		);

		this.ogmaService.ogma.events.onKeyPress('shift e', () =>
			this.clickedOnExpandButton({
				nodeIds: this.ogmaService.ogma.getSelectedNodes().getId()
			})
		);

		this.ogmaService.ogma.events.onKeyPress('shift s', () =>
			this.ogmaService.setSource(this.ogmaService.ogma.getSelectedNodes())
		);

		this.ogmaService.ogma.events.onKeyPress('shift t', () =>
			this.ogmaService.setTarget(this.ogmaService.ogma.getSelectedNodes())
		);

		this.ogmaService.ogma.events.onKeyPress('shift n', () =>
			this.ogmaService.setNormal(this.ogmaService.ogma.getSelectedNodes())
		);

		this.ogmaService.ogma.events.onKeyPress('shift f', () =>
			this.findFlow()
		);

		this.ogmaService.ogma.events.onKeyPress('shift a', () => {
			this.ogmaService.ogma.getNodes().setSelected(true);
		});
	}

	public findFlow() {
		const error = this.ogmaService.findFlow(this.snackbar);

		if (error) {
			this.snackbar.show(error, 'danger');
			return;
		}
	}

	setRectangleSelected() {
		if (this.ogmaService.ogma.keyboard.isKeyPressed('ctrl')) {
			if (!this.ogmaService.ogma.keyboard.isKeyPressed('shift')) {
				this.ogmaService.ogma.getSelectedNodes().setSelected(false);
				this.ogmaService.ogma.getSelectedEdges().setSelected(false);
			}

			this.ogmaService.ogma.tools.rectangleSelect.enable({
				bothExtremities: true,
				callback({ nodes, edges }) {
					nodes.setSelected(true);
					edges.setSelected(true);
				}
			});
		}
	}

	private copyNodesAndEdges() {
		this.copiedNodes = this.ogmaService.ogma.getSelectedNodes().dedupe();
		this.copiedEdges = this.ogmaService.ogma.getSelectedEdges().dedupe();
	}

	private pasteNodesAndEdges() {
		this.copiedNodes.forEach((node) =>
			this.ogmaService.addNode(node.getData())
		);
		this.copiedEdges.forEach((edge) =>
			this.ogmaService.addEdge(edge.getData())
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
				[
					'مجموع مبالغ ورودی',
					(+target.getData('totalIncome')).toLocaleString()
				],
				[
					'مجموع مبالغ خروجی',
					(+target.getData('totalDeposit')).toLocaleString()
				],
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
