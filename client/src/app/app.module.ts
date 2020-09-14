import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GraphComponent } from './pages/graph/graph.component';

import { TooltipComponent } from './components/tooltip/tooltip.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchNodesModalComponent } from './components/search-nodes-modal/search-nodes-modal.component';
import { SearchNodesResultComponent } from './components/search-nodes-result/search-nodes-result.component';

import { SvgIconsModule } from '@ngneat/svg-icon';
import icons from '../assets/svg/svg-icons';
import { RadialNodeMenuComponent } from './components/radial-node-menu/radial-node-menu.component';
import { SearchNodesFormComponent } from './components/search-nodes-form/search-nodes-form.component';
import { SearchNodesDetailsComponent } from './components/search-nodes-details/search-nodes-details.component';
import { RoundButtonComponent } from './components/round-button/round-button.component';
import { NodeTooltipComponent } from './components/node-tooltip/node-tooltip.component';
import { EdgeTooltipComponent } from './components/edge-tooltip/edge-tooltip.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

@NgModule({
	declarations: [
		AppComponent,
		GraphComponent,
		TooltipComponent,
		HeaderComponent,
		FooterComponent,
		SearchNodesModalComponent,
		SearchNodesResultComponent,
		RadialNodeMenuComponent,
		SearchNodesFormComponent,
		SearchNodesDetailsComponent,
		RoundButtonComponent,
		NodeTooltipComponent,
		EdgeTooltipComponent,
		SnackbarComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		DragDropModule,
		SvgIconsModule.forRoot({
			icons
		})
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
