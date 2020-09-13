import { Injectable } from '@angular/core';
import Ogma, { RawNode, RawEdge } from '../../dependencies/ogma.min.js';
import { GraphService } from './graph.service';
import { AccountNode } from '../models/AccountNode.js';

@Injectable({
	providedIn: 'root'
})
export class OgmaService {
	public ogma: Ogma;
	private sourceNode = null;
	private targetNode = null;

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

	public addNode(data?: AccountNode, attributes?): void {
		let id;

		if (data) id = data.accountId;
		else id = this.ogma.getNodes().getId().length;

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

	public deleteNode(nodeId) {
		this.ogma.removeNode(nodeId);
	}

	public runLayout(layout: string = 'force'): Promise<void> {
		return this.ogma.layouts[layout]({ locate: true });
	}

	public expandNode(nodeId) {
		// let jsonResponse;
		// this.graphService.expandRequest('[nodeId]', jsonResponse);

		let jsonResponse = this.graphService.expandRequest('[nodeId]');

		let nodes = [];
		let edges = [];
		jsonResponse.forEach((single) => {
			single.item1.forEach((node) => nodes.push(this.modifyNode(node)));
			single.item2.forEach((edge) => edges.push(this.modifyEdge(edge)));
		});

		this.ogma.addNodes(nodes);
		this.ogma.addEdges(edges);
		this.runLayout();
	}

	private modifyNode(node) {
		let temp = {};
		temp['id'] = node.AccountID;
		temp['data'] = node;
		return temp;
	}

	private modifyEdge(edge) {
		let temp = {};
		temp['id'] = edge.TransactionID;
		temp['source'] = edge.SourceAcount;
		temp['target'] = edge.DestiantionAccount;
		temp['data'] = edge;
		return temp;
	}

	lockNodes(nodesList) {
		nodesList.setAttributes({
			draggable: false
		});
	}

	unlockNodes(nodesList) {
		nodesList.setAttributes({
			draggable: true
		});
	}

	setSource(node) {
		this.sourceNode = node;
	}

	setTarget(node) {
		this.targetNode = node;
	}

	removeSource() {
		this.sourceNode = null;
	}

	removeTarget() {
		this.targetNode = null;
	}
}
