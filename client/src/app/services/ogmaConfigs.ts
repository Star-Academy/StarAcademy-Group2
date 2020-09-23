export let maxTransactionAmount: number = 0;
export const setMaxTransactionAmount = (value: number) =>
	(maxTransactionAmount = value);

export default {
	attributes: {
		default: {
			nodes: {
				shape: 'square',
				color: 'transparent',
				outerStroke: 'transparent',
				innerStroke: 'transparent',
				layer: 1,
				image: {
					fit: true,
					url: '../../../assets/svg/washing_machine.svg'
				},
				text: (node) => ({
					content: node.getId(),
					margin: 0,
					padding: 5,
					scale: 0.15,
					scaling: true
				})
			},
			selectedNodes: {
				color: false,
				outline: false,
				outerStroke: {
					color: '#6495ed'
				}
			},
			hoveredNodes: {
				color: false,
				outline: false,
				outerStroke: {
					color: '#44d96c'
				}
			},
			edges: {
				text: {
					scale: 1,
					scaling: true
				},
				shape: { head: 'arrow' },
				color: (edge) => {
					let gb = 1 - +edge.getData('Amount') / maxTransactionAmount;
					gb = Math.max(60, Math.min(200, Math.floor(255 * gb)));

					return `rgb(255, ${gb}, ${gb})`;
				},
				width: (edge) =>
					1 + 1.5 * +edge.getData('Amount') / maxTransactionAmount
			}
		},
		edgesAmount: {
			text: (edge) => ({
				content: (+edge.getData('Amount')).toLocaleString()
			})
		},
		edgesPercent: {
			text: (edge) => ({
				content: edge.getData('percent').toFixed(2) + '%'
			})
		}
	},
	classes: {
		normal: {
			image: '../../../assets/svg/washing_machine.svg'
		},
		source: {
			image: '../../../assets/svg/money_source.svg'
		},
		target: {
			image: '../../../assets/svg/clean_clothes.svg'
		},
		locked: {
			badges: {
				topRight: {
					color: '#ffb726',
					scale: 0.3,
					image: {
						scale: 0.5,
						url: '../../assets/svg/lock.svg'
					},
					positionScale: 1.2,
					stroke: {
						color: 'transparent',
						width: 0
					}
				}
			},
			draggable: false
		},
		unlocked: {
			badges: null,
			draggable: true
		},
		maxFlow: {
			color: 'pink',
			width: 3,
			opacity: 0.5
		},
		dummy: {
			opacity: 0,
			detectable: false,
			layer: -1
		}
	}
};
