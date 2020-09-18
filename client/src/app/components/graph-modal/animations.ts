import {
	trigger,
	transition,
	animate,
	style,
	state,
	keyframes
} from '@angular/animations';

export const Animations = [
	trigger('overlayState', [
		state(
			'closed',
			style({
				opacity: 0
			})
		),
		state(
			'open',
			style({
				opacity: 1
			})
		),
		transition(
			'closed => open',
			animate(
				'300ms',
				keyframes([ style({ opacity: 0 }), style({ opacity: 1 }) ])
			)
		),
		transition(
			'open => closed',
			animate(
				'300ms',
				keyframes([ style({ opacity: 1 }), style({ opacity: 0 }) ])
			)
		)
	]),
	trigger('modalState', [
		state(
			'closed',
			style({
				opacity: 0,
				transform: 'scale(0.3)'
			})
		),
		state(
			'form',
			style({
				opacity: 1,
				transform: 'scale(1)'
			})
		),

		state(
			'results',
			style({
				opacity: 1
			})
		),
		state(
			'details',
			style({
				opacity: 1
			})
		),
		transition(
			'closed => form',
			animate(
				'300ms',
				keyframes([
					style({ transform: 'scale(0)', opacity: 1 }),
					style({ transform: 'scale(1.05)', opacity: 1 }),
					style({ transform: 'scale(0.95)', opacity: 1 }),
					style({ transform: 'scale(1)' })
				])
			)
		),
		transition(
			'form => results, results => details, details => results, results => form',
			animate(
				'600ms',
				keyframes([
					style({ transform: 'scale(1)' }),
					style({ transform: 'scale(1.2)' }),
					style({ transform: 'scale(0)' }),
					style({ transform: 'scale(1.05)', opacity: 1 }),
					style({ transform: 'scale(0.95)', opacity: 1 }),
					style({ transform: 'scale(1)' })
				])
			)
		),
		transition(
			'form => closed, results => closed, details => closed',
			animate(
				'300ms',
				keyframes([
					style({ transform: 'scale(1)' }),
					style({ transform: 'scale(0.9)' }),
					style({ transform: 'scale(1.1)' }),
					style({ transform: 'scale(0.5)' })
				])
			)
		)
	])
];
