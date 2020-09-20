import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	public default: Color = new Color(Color.WHITE, Color.GRAY_10);
	public primary: Color = new Color(Color.BLUE_CORNFLOWER, Color.GRAY_95);
	public secondary: Color = new Color(Color.GRAY_60, Color.GRAY_95);
	public success: Color = new Color(Color.GREEN_EMERALD, Color.GRAY_95);
	public danger: Color = new Color(Color.RED_FLAMINGO, Color.GRAY_95);
	public warning: Color = new Color(Color.ORANGE_SUPERNOVA, Color.GRAY_10);
	public info: Color = new Color(Color.GREEN_CARIBBEAN, Color.GRAY_95);
	public light: Color = new Color(Color.GRAY_95, Color.GRAY_10);
	public dark: Color = new Color(Color.GRAY_10, Color.GRAY_95);
	public label: Color = new Color(Color.INHERIT, Color.GRAY_60);

	//TODO: load initial data from localStorage
}

class Color {
	public static readonly INHERIT = 'inherit';
	public static readonly BLUE_CORNFLOWER = '#6495ed';
	public static readonly GREEN_EMERALD = '#44d96c';
	public static readonly GREEN_CARIBBEAN = '#3b9a9c';
	public static readonly ORANGE_SUPERNOVA = '#ffb726';
	public static readonly RED_FLAMINGO = '#e64e4e';
	public static readonly WHITE = '#ffffff';
	public static readonly GRAY_95 = '#f2f2f2';
	public static readonly GRAY_60 = '#999999';
	public static readonly GRAY_10 = '#1a1a1a';

	public constructor(public background: string, public color: string) {}
}
