import { Injectable } from '@angular/core';

import Ogma, {
	Node,
	NodeList,
	RawNode,
	NodeId,
	EdgeList
} from '../../dependencies/ogma.min.js';

import { ThemeService } from './theme.service.js';
import { GraphService } from './graph.service';

import { AccountNode } from '../models/AccountNode.js';
import { TransactionEdge } from '../models/TransactionEdge.js';

import configs, {
	maxTransactionAmount,
	setMaxTransactionAmount
} from './ogmaConfigs';
import { SnackbarComponent } from '../components/snackbar/snackbar.component.js';

@Injectable({
	providedIn: 'root'
})
export class OgmaService {
	public ogmaArray = [];
	public ogma: Ogma;
	public tabIndex;

	private sourceNode: NodeList[] = [];
	private targetNode: NodeList[] = [];

	private edgeNormalContentType: boolean[] = [];

	public layouts: Name[] = [
		new Name('force', 'فورس'),
		new Name('hierarchical', 'درخت'),
		new Name('sequential', 'متوالی')
	];
	public directions: Name[] = [
		new Name('TB', 'بالا به پایین'),
		new Name('BT', 'پایین به بالا'),
		new Name('LR', 'چپ به راست'),
		new Name('RL', 'راست به چپ')
	];

	public currentLayout: Name = this.layouts[2];
	public currentDirection: Name = this.directions[2];

	public configuration = {
		options: {
			backgroundColor: this.theme.default.background,
			directedEdges: true,
			minimumWidth: '1920',
			minimumHeight: '826'
		}
	};

	public constructor(
		private theme: ThemeService,
		private graphService: GraphService
	) {}

	public initConfig() {
		this.ogma = new Ogma(this.configuration);
		this.setInitialStyles(this.ogma);
		this.edgeNormalContentType.push(true);
		this.sourceNode.push(this.ogma.getNodes([]));
		this.targetNode.push(this.ogma.getNodes([]));
		this.tabIndex = 0;
		this.ogmaArray.push(this.ogma);
	}

	tabChange(index, container) {
		this.tabIndex = index;
		this.ogma.setContainer(null);
		this.ogma = this.ogmaArray[this.tabIndex];
		this.ogma.setContainer(container);

		this.graphService.changeTab(this.tabIndex).subscribe();
		this.ogma.view.locateGraph();
	}

	tabAdd(index, container) {
		this.graphService.addTab().subscribe();
		let temp = new Ogma(this.configuration);
		this.setInitialStyles(temp);
		this.edgeNormalContentType.push(true);
		this.sourceNode.push(this.ogma.getNodes([]));
		this.targetNode.push(this.ogma.getNodes([]));
		this.ogmaArray.push(temp);
		this.tabChange(index, container);
	}

	tabDelete(index, container) {
		this.graphService.deleteTab(index).subscribe();
		this.ogmaArray.splice(index, 1);
		this.edgeNormalContentType.splice(index, 1);
		this.sourceNode.splice(index, 1);
		this.targetNode.splice(index, 1);
		if (this.tabIndex == index) {
			if (this.tabIndex == 0) {
				this.tabChange(0, container);
			} else {
				this.tabChange(index - 1, container);
			}
		} else if (this.tabIndex > index) {
			this.tabIndex -= 1;
		}
		this.graphService.changeTab(this.tabIndex);
	}

	restartTabs() {
		this.graphService.restartTabs().subscribe();
	}

	public addNode(data, attributes?, register = true) {
		data['totalDeposit'] = 0;
		data['totalIncome'] = 0;

		let node = this.ogma.addNode({
			data,
			attributes,
			id: data.AccountID
		});

		if (!node) return node;

		if (data['nodeType'] && data['nodeType'] === 'source') {
			node.setAttributes(configs.classes.source);
		} else if (data['nodeType'] && data['nodeType'] === 'target') {
			node.setAttributes(configs.classes.target);
		} else if (data['OwnerName'].startsWith('شرکت'))
			node.setAttributes(configs.classes.company);

		this.runLayout();

		if (register)
			this.graphService
				.addNode(data)
				.subscribe((edges: TransactionEdge[]) => {
					for (const edge of edges) this.addEdge(edge);
					this.runLayout();
				});

		return node;
	}

	public removeNode = (nodeId: NodeId) => this.ogma.removeNodes(nodeId);

	public lockNodes = (nodes: NodeList) =>
		nodes.setAttributes(configs.classes.locked);

	public unlockNodes = (nodes: NodeList) =>
		nodes.setAttributes(configs.classes.unlocked);

	public toggleNodeLockStatus = (node: Node) =>
		node.getAttribute('draggable')
			? this.lockNodes(node)
			: this.unlockNodes(node);

	public getSourceNode = () => this.sourceNode[this.tabIndex];
	public getTargetNode = () => this.targetNode[this.tabIndex];

	public isSourceNode(node) {
		if (node.getData('nodeType') && node.getData('nodeType') === 'source')
			return true;
		return false;
	}

	public isTargetNode(node) {
		if (node.getData('nodeType') && node.getData('nodeType') === 'target')
			return true;
		return false;
	}

	public setSource(nodes) {
		nodes.setAttributes(configs.classes.source);
		nodes.setData('nodeType', function(node) {
			return 'source';
		});
	}

	public setTarget(nodes) {
		nodes.setAttributes(configs.classes.target);
		nodes.setData('nodeType', function(node) {
			return 'target';
		});
	}

	public setNormal(nodes) {
		nodes.forEach((node) => {
			if (node.getData('OwnerName').startsWith('شرکت'))
				node.setAttributes(configs.classes.company);
			else node.setAttributes(configs.classes.normal);
		});

		nodes.setData('nodeType', function(node) {
			return 'normal';
		});
	}

	public expand(nodeIds: string[], filters) {
		let request = { accounts: nodeIds, ...filters };

		this.graphService.expand(request).subscribe((res: { item1; item2 }) => {
			res.item1.forEach((node) => this.addNode(node));
			res.item2.forEach((edge) => this.addEdge(edge));
		});
	}

	public findPath(maxLength: number, snackbar: SnackbarComponent) {
		const sources = this.getWithTypes('source');
		const targets = this.getWithTypes('target');

		if (sources.size === 0)
			return 'لطفاً ابتدا حداقل یک راس را به عنوان مبدأ انتخاب کنید';
		if (targets.size === 0)
			return 'لطفاً ابتدا حداقل یک راس را به عنوان مقصد انتخاب کنید';

		this.graphService
			.findPath(sources.getId(), targets.getId(), maxLength)
			.subscribe(
				(res: any) => {
					this.ogma.removeNodes(this.ogma.getNodes('raw'));

					sources.forEach((node) => {
						this.addNode(node.getData(), {}, false);
					});
					targets.forEach((node) => {
						this.addNode(node.getData(), {}, false);
					});

					res.item1.forEach((node) => this.addNode(node, {}, false));
					res.item2.forEach((edge) => this.addEdge(edge));

					this.runLayout();
				},
				(_) => {
					snackbar.show(
						'درخواست پردازش مسیر با خطا مواجه شد',
						'danger'
					);
				}
			);
	}

	findFlow(snackbar: SnackbarComponent) {
		const sources = this.getWithTypes('source');
		const targets = this.getWithTypes('target');

		if (sources.size === 0)
			return 'لطفاً ابتدا حداقل یک راس را به عنوان مبدأ انتخاب کنید';
		if (targets.size === 0)
			return 'لطفاً ابتدا حداقل یک راس را به عنوان مقصد انتخاب کنید';

		this.graphService
			.findMaxFlow(sources.getId(), targets.getId())
			.subscribe((res) => {
				snackbar.show(
					`بیشینۀ شار محاسبه‌شده: ${(+res).toLocaleString()}`,
					'success',
					0,
					true
				);
			});
	}

	getWithTypes(type) {
		return this.ogma.getNodes().filter((node) => {
			if (node.getData('nodeType') && node.getData('nodeType') === type) {
				return true;
			}
			return false;
		});
	}

	public toggleEdgesContentType() {
		this.edgeNormalContentType[this.tabIndex] = !this.edgeNormalContentType[
			this.tabIndex
		];

		this.updateEdgesContent();
	}

	public saveGraph(): Promise<string> {
		return this.ogma.export.json({
			download: true,
			edgeAttributes: 'all',
			filter: 'all'
		});
	}

	public loadGraph(data) {
		this.ogma.parse.json(data).then(({ nodes, edges }) => {
			this.clearGraph();

			nodes.forEach((node) => this.addNode(node.data));
			edges.forEach((edge) => this.addEdge(edge.data));
		});
	}

	public runLayout() {
		this.ogma.layouts[this.currentLayout.en]({
			arrangeComponents: 'fit',
			locate: true,
			direction: this.currentDirection.en,
			nodeDistance: 30,
			levelDistance: 40
		});
	}

	private setInitialStyles(ogma) {
		ogma.styles.setSelectedNodeAttributes(
			configs.attributes.default.selectedNodes
		);

		ogma.styles.setHoveredNodeAttributes(
			configs.attributes.default.hoveredNodes
		);

		ogma.styles.addRule({
			nodeAttributes: configs.attributes.default.nodes,
			edgeAttributes: configs.attributes.default.edges
		});
	}

	public addEdge(data: TransactionEdge) {
		const source = this.ogma.getNode(data.SourceAccount);
		const target = this.ogma.getNode(data.DestinationAccount);

		if (!source || !target) return;

		const result = this.ogma.addEdge({
			source: data.SourceAccount,
			target: data.DestinationAccount,
			data,
			id: data.TransactionID
		});

		if (!result) return;

		const totalDeposit = +source.getData('totalDeposit') + +data.Amount;
		source.setData('totalDeposit', totalDeposit);

		const totalIncome = +target.getData('totalIncome') + +data.Amount;
		target.setData('totalIncome', totalIncome);

		this.setEdgesPercentValue(source, totalDeposit);

		const amount = +result.getData('Amount');
		if (amount > maxTransactionAmount) {
			setMaxTransactionAmount(amount);
		}

		this.updateEdgesContent();
	}

	private setEdgesPercentValue(node: Node, totalDeposit: number) {
		const edges = node.getAdjacentEdges({ direction: 'out' });

		for (const edge of edges.toArray())
			edge.setData(
				'percent',
				edge.getData('Amount') / totalDeposit * 100
			);

		this.updateEdgesContent(edges);
	}

	private updateEdgesContent(edges: EdgeList = this.ogma.getEdges()) {
		const attributes = this.edgeNormalContentType[this.tabIndex]
			? configs.attributes.edgesAmount
			: configs.attributes.edgesPercent;

		edges.setAttributes({
			...configs.attributes.default.edges,
			...attributes
		});
	}

	private clearGraph() {
		// TODO: wrap this in one request
		for (const node of this.ogma.getNodes().toArray())
			this.removeNode(node.getId());

		this.ogma.clearGraph();
	}
}

class Name {
	public constructor(public en: string, public fa: string) {}
}
