import { Injectable } from '@angular/core';

import Ogma, { NodeId, RawNode, RawEdge } from '../../dependencies/ogma.min.js';

import { GraphService } from './graph.service';

import { AccountNode } from '../models/AccountNode.js';
import { TransactionEdge } from '../models/TransactionEdge.js';
import { JsonPipe } from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class OgmaService {
	ogma: Ogma;
	sourceNode = null;
	targetNode = null;

	constructor(private graphService: GraphService) {}

	public initConfig(configuration = {}) {
		this.ogma = new Ogma(configuration);
		this.ogma.setOptions({ zoom: { enabled: false } });

		this.ogma.styles.setSelectedNodeAttributes({
			color: false,
			outline: false,
			outerStroke: {
				color: 'blue'
			}
		});

		this.ogma.styles.setHoveredNodeAttributes({
			color: false,
			outline: false,
			outerStroke: {
				color: 'green'
			}
		});

		this.addRule();
	}

	public runLayout(layout: string = 'force'): Promise<void> {
		return this.ogma.layouts[layout]({ locate: true });
	}

	public addRule() {
		this.ogma.styles.addRule({
			nodeAttributes: {
				text: (node) => {
					return node.getId();
				}
			},
			edgeAttributes: {
				text: (node) => {
					return node.getData('Amount');
				},
				shape: { head: 'arrow' }
			}
		});
	}

	public addNode(data: AccountNode, attributes?): void {
		let id = data.AccountID;

		this.graphService.addNode(data).subscribe((res: TransactionEdge[]) => {
			for (let edge of res) {
				if (
					this.ogma.getNode(edge.SourceAccount) &&
					this.ogma.getNode(edge.DestinationAccount)
				) {
					this.addEdge(
						edge.SourceAccount,
						edge.DestinationAccount,
						edge
					);
				}
			}
		});

		attributes = {
			shape: 'square',
			color: 'transparent',
			outerStroke: 'transparent',
			innerStroke: 'transparent',
			image: {
				fit: true,
				url: '../../../assets/svg/washing_machine.svg'
			},
			...attributes
		};

		this.ogma.addNode({ data, attributes, id });
	}

	public addEdge(
		source: NodeId,
		target: NodeId,
		data?: TransactionEdge,
		attributes?
	) {
		let id = this.ogma.getEdges().getId().length;
		if (data) id = data.TransactionID;

		this.ogma.addEdge({ source, target, data, attributes, id });
	}

	public removeNode(nodeId) {
		this.ogma.removeNode(nodeId);
	}

	public expandNode(nodeIds: string[], filter?) {
		let request = { accounts: nodeIds };
		if (filter) {
			request['amountCeiling'] = String(filter.amountCeiling);
			request['amountFloor'] = String(filter.amountFloor);
			request['dateCeiling'] = String(filter.dateCeiling);
			request['dateFloor'] = String(filter.dateFloor);
			if (filter.tratransactionId) {
				request['transactionId'] = String(filter.transactionId);
			}
			if (filter.type) {
				request['type'] = String(filter.type);
			}
		}
		let jsonResponse = this.graphService.expandRequest(request);
		jsonResponse.subscribe((res) => {
			let jsonString = JSON.parse(JSON.stringify(res));
			jsonString.forEach((single) => {
				single.item1.forEach((node: AccountNode) => this.addNode(node));
			});
			jsonString.forEach((single) => {
				single.item2.forEach((edge: TransactionEdge) => {
					this.addEdge(
						edge.SourceAccount,
						edge.DestinationAccount,
						edge
					);
				});
			});
			this.runLayout();
		});
	}

	lockNodes(nodes) {
		nodes.setAttributes({
			color: 'gray',
			draggable: false
		});
	}

	unlockNodes(nodes) {
		nodes.setAttributes({
			color: 'transparent',
			draggable: true
		});
	}

	toggleNodeLockStatus(node) {
		node.getAttribute('draggable')
			? this.lockNodes(node)
			: this.unlockNodes(node);
	}

	getSourceNode() {
		return this.sourceNode;
	}

	getTargetNode() {
		return this.targetNode;
	}

	setSource(node) {
		if (this.sourceNode) this.removeSource();
		this.sourceNode = node;

		this.sourceNode.setAttributes({
			image: {
				fit: true,
				url: '../../../assets/svg/money_source.svg'
			}
		});
	}

	setTarget(node) {
		if (this.targetNode) this.removeTarget();
		this.targetNode = node;

		this.targetNode.setAttributes({
			image: {
				fit: true,
				url: '../../../assets/svg/clean_clothes.svg'
			}
		});
	}

	removeSource() {
		this.sourceNode.setAttributes({
			image: {
				fit: true,
				url: '../../../assets/svg/washing_machine.svg'
			}
		});

		this.sourceNode = null;
	}

	removeTarget() {
		this.targetNode.setAttributes({
			image: {
				fit: true,
				url: '../../../assets/svg/washing_machine.svg'
			}
		});

		this.targetNode = null;
	}
}
