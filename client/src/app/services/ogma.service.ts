import { Injectable } from '@angular/core';

import Ogma, {
	Node,
	NodeList,
	RawNode,
	NodeId,
	EdgeList
} from '../../dependencies/ogma.min.js';

import { GraphService } from './graph.service';

import { AccountNode } from '../models/AccountNode.js';
import { TransactionEdge } from '../models/TransactionEdge.js';

import configs, {
	maxTransactionAmount,
	setMaxTransactionAmount
} from './ogmaConfigs';

@Injectable({
	providedIn: 'root'
})
export class OgmaService {
	public ogma: Ogma;

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

	private sourceNode: RawNode;
	private targetNode: RawNode;

	private edgeNormalContentType: boolean;

	public constructor(private graphService: GraphService) {}

	public initConfig(configuration = {}) {
		this.ogma = new Ogma(configuration);
		this.edgeNormalContentType = true;

		this.setInitialStyles();
	}

	public addNode(data: AccountNode, attributes?, register = true) {
		data['totalDeposit'] = 0;
		const node = this.ogma.addNode({
			data,
			attributes,
			id: data.AccountID
		});

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

	public getSourceNode = () => this.sourceNode;
	public getTargetNode = () => this.targetNode;

	public setSource(node: Node) {
		if (this.sourceNode) this.removeSource();
		this.sourceNode = node;

		this.sourceNode.setAttributes(configs.classes.source);
	}

	public setTarget(node: RawNode) {
		if (this.targetNode) this.removeTarget();
		this.targetNode = node;

		this.targetNode.setAttributes(configs.classes.target);
	}

	public removeSource() {
		this.sourceNode.setAttributes(configs.classes.normal);
		this.sourceNode = null;
	}

	public removeTarget() {
		this.targetNode.setAttributes(configs.classes.normal);
		this.targetNode = null;
	}

	public expand(nodeIds: string[], filters) {
		let request = { accounts: nodeIds, ...filters };

		this.graphService.expand(request).subscribe((res: any[]) => {
			res.forEach(({ item1, item2 }) => {
				item1.forEach((node) => this.addNode(node));
				item2.forEach((edge) => this.addEdge(edge));
			});
		});
	}

	public findPath(maxLength: number) {
		this.ogma.removeNodes(this.ogma.getNodes('raw'));

		this.setSource(this.addNode(this.sourceNode.getData(), null, false));
		this.setTarget(this.addNode(this.targetNode.getData(), null, false));

		const sourceId = this.sourceNode.getId();
		const targetId = this.targetNode.getId();

		this.graphService.findMaxFlow(sourceId, targetId).subscribe((res) => {
			this.ogma.addEdge({
				id: 'dummy',
				source: sourceId,
				target: targetId,
				attributes: configs.classes.dummy
			});

			this.ogma.addEdge({
				id: 'max-flow',
				source: sourceId,
				target: targetId,
				attributes: configs.classes.maxFlow,
				data: { Amount: res }
			});
		});

		this.graphService
			.findPath(
				this.sourceNode.getId(),
				this.targetNode.getId(),
				maxLength
			)
			.subscribe((res: any) => {
				res.item1.forEach((node) => this.addNode(node));
				res.item2.forEach((edge) => this.addEdge(edge));

				this.runLayout();
			});
	}

	public toggleEdgesContentType() {
		this.edgeNormalContentType = !this.edgeNormalContentType;

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
			direction: this.currentDirection.en
		});
	}

	private setInitialStyles() {
		this.ogma.styles.setSelectedNodeAttributes(
			configs.attributes.default.selectedNodes
		);

		this.ogma.styles.setHoveredNodeAttributes(
			configs.attributes.default.hoveredNodes
		);

		this.ogma.styles.addRule({
			nodeAttributes: configs.attributes.default.nodes,
			edgeAttributes: configs.attributes.default.edges
		});
	}

	private addEdge(data: TransactionEdge) {
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
		const attributes = this.edgeNormalContentType
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
