import {
	trigger,
	transition,
	animate,
	style,
	state,
	keyframes
} from '@angular/animations';

export const Animations = [
	trigger('menuState', [
		state(
			'closed',
			style({
				display: 'none'
			})
		),
		state(
			'open',
			style({
				display: 'block'
			})
		),
		transition(
			'closed => open',
			animate(
				'300ms',
				keyframes([
					style({ display: 'none' }),
					style({ display: 'block' })
				])
			)
		),
		transition(
			'open => closed',
			animate(
				'300ms',
				keyframes([
					style({ display: 'block' }),
					style({ display: 'none' })
				])
			)
		)
	])
];
