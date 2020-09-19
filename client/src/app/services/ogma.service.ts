import { Injectable } from '@angular/core';

import Ogma, {
	Node,
	NodeList,
	RawNode,
	NodeId
} from '../../dependencies/ogma.min.js';

import { GraphService } from './graph.service';

import { AccountNode } from '../models/AccountNode.js';
import { TransactionEdge } from '../models/TransactionEdge.js';

import configs from './ogmaConfigs';

@Injectable({
	providedIn: 'root'
})
export class OgmaService {
	private ogma: Ogma;
	private sourceNode: RawNode;
	private targetNode: RawNode;

	constructor(private graphService: GraphService) {}

	public initConfig(configuration = {}) {
		this.ogma = new Ogma(configuration);

		this.setInitialStyles();
	}

	public runLayout(layout: string) {
		return this.ogma.layouts[layout]({ locate: true });
	}

	public addNode(data: AccountNode, attributes?, register = true) {
		if (register)
			this.graphService
				.addNode(data)
				.subscribe((edges: TransactionEdge[]) => {
					for (const edge of edges) this.addEdge(edge);
				});

		this.ogma.addNode({ data, attributes, id: data.AccountID });
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

			this.runLayout('force');
		});
	}

	public findPath(maxLength: number) {
		this.clearGraph();

		this.setSource(this.addUnregisteredNode(this.sourceNode.getData()));
		this.setTarget(this.addUnregisteredNode(this.targetNode.getData()));

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

				// TODO: use layout manager
				this.ogma.layouts.hierarchical({
					direction: 'LR',
					duration: 300,
					nodeDistance: 30,
					levelDistance: 40
				});
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

	private addUnregisteredNode(data: AccountNode, attributes?) {
		return this.ogma.addNode({ data, attributes, id: data.AccountID });
	}

	private addEdge(data: TransactionEdge) {
		if (
			this.ogma.getNodes([ data.SourceAccount, data.DestinationAccount ])
				.size !== 2
		)
			return;

		this.ogma.addEdge({
			source: data.SourceAccount,
			target: data.DestinationAccount,
			data,
			id: data.TransactionID
		});
	}

	private clearGraph = () => this.ogma.removeNodes(this.ogma.getNodes('raw'));
}
