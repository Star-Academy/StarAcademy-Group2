import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	// Default Styles
	public _default: Color = new Color(Color.WHITE, Color.GRAY_10);
	public _primary: Color = new Color(Color.BLUE_CORNFLOWER, Color.GRAY_95);
	public _secondary: Color = new Color(Color.GRAY_60, Color.GRAY_95);
	public _success: Color = new Color(Color.GREEN_EMERALD, Color.GRAY_95);
	public _danger: Color = new Color(Color.RED_FLAMINGO, Color.GRAY_95);
	public _warning: Color = new Color(Color.ORANGE_SUPERNOVA, Color.GRAY_10);
	public _info: Color = new Color(Color.GREEN_CARIBBEAN, Color.GRAY_95);

	public _light: Color = new Color(Color.GRAY_95, Color.GRAY_10);
	public _dark: Color = new Color(Color.GRAY_25, Color.GRAY_90);

	public _label: Color = new Color(Color.INHERIT, Color.GRAY_60);
	public _disabled: Color = new Color(Color.GRAY_90, Color.GRAY_60);

	// Actual Styles
	public default: Color = new Color(Color.WHITE, Color.GRAY_10);
	public primary: Color = new Color(Color.BLUE_CORNFLOWER, Color.GRAY_95);
	public secondary: Color = new Color(Color.GRAY_60, Color.GRAY_95);
	public success: Color = new Color(Color.GREEN_EMERALD, Color.GRAY_95);
	public danger: Color = new Color(Color.RED_FLAMINGO, Color.GRAY_95);
	public warning: Color = new Color(Color.ORANGE_SUPERNOVA, Color.GRAY_10);
	public info: Color = new Color(Color.GREEN_CARIBBEAN, Color.GRAY_95);

	public light: Color = new Color(Color.GRAY_95, Color.GRAY_10);
	public dark: Color = new Color(Color.GRAY_25, Color.GRAY_90);

	public label: Color = new Color(Color.INHERIT, Color.GRAY_60);
	public disabled: Color = new Color(Color.GRAY_90, Color.GRAY_60);

	public constructor() {
		for (let styleName of Object.keys(this)) {
			const savedStyle = localStorage.getItem(`theme_${styleName}`);

			if (savedStyle) {
				const { background, color } = JSON.parse(savedStyle);

				this[styleName]['background'] = background;
				this[styleName]['color'] = color;
			}
		}
	}

	public resetColor(name: string) {
		this[name] = this[`_${name}`];
	}
}

export class Color {
	public static readonly INHERIT = 'inherit';
	public static readonly BLUE_CORNFLOWER = '#6495ed';
	public static readonly GREEN_EMERALD = '#44d96c';
	public static readonly GREEN_CARIBBEAN = '#3b9a9c';
	public static readonly ORANGE_SUPERNOVA = '#ffb726';
	public static readonly RED_FLAMINGO = '#e64e4e';
	public static readonly WHITE = '#ffffff';
	public static readonly GRAY_95 = '#f2f2f2';
	public static readonly GRAY_90 = '#e6e6e6';
	public static readonly GRAY_75 = '#bfbfbf';
	public static readonly GRAY_60 = '#999999';
	public static readonly GRAY_25 = '#3F3F3F';
	public static readonly GRAY_10 = '#1a1a1a';

	public constructor(public background: string, public color: string) {}

	public get selected(): Color {
		return new Color(Color.brighter(this.background), this.color);
	}

	public get hovered(): Color {
		return new Color(Color.darker(this.background), this.color);
	}

	public get reverse(): Color {
		return new Color(this.color, this.background);
	}

	public static brighter(color: string): string {
		return this.luminance(color, 0.1);
	}

	public static darker(color: string): string {
		return this.luminance(color, -0.1);
	}

	private static luminance(color: string, offset: number): string {
		color = this.normalized(color);

		let result = '#';
		for (let i = 0; i < 3; i++) {
			let n: number = parseInt(color.substr(2 * i, 2), 16);
			let c: string = Math.round(
				Math.min(255, Math.max(0, (1 + offset) * n))
			).toString(16);

			result += ('00' + c).substr(c.length);
		}

		return result;
	}

	private static normalized(color: string): string {
		color = String(color).replace(/[^0-9a-f]/gi, '');

		if (color.length < 6)
			color =
				color[0] + color[0] + color[1] + color[1] + color[2] + color[2];

		return color;
	}
}
