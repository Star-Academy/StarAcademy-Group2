import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SvgIconsModule } from '@ngneat/svg-icon';
import icons from '../assets/svg/svg-icons';

import { TokenInterceptorService } from './services/token-interceptor.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GraphComponent } from './pages/graph/graph.component';
import { FaqComponent } from './pages/faq/faq.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { GraphModalComponent } from './components/graph-modal/graph-modal.component';
import { SearchNodesResultComponent } from './components/search-nodes-result/search-nodes-result.component';
import { RadialNodeMenuComponent } from './components/radial-node-menu/radial-node-menu.component';
import { SearchNodesFormComponent } from './components/search-nodes-form/search-nodes-form.component';
import { SearchNodesDetailsComponent } from './components/search-nodes-details/search-nodes-details.component';
import { RoundButtonComponent } from './components/round-button/round-button.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { SearchEdgesFormComponent } from './components/search-edges-form/search-edges-form.component';
import { SearchEdgesDetailsComponent } from './components/search-edges-details/search-edges-details.component';
import { GraphTooltipComponent } from './components/graph-tooltip/graph-tooltip.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LayoutSelectorComponent } from './components/layout-selector/layout-selector.component';

@NgModule({
	declarations: [
		AppComponent,
		GraphComponent,
		HeaderComponent,
		FooterComponent,
		GraphModalComponent,
		SearchNodesResultComponent,
		RadialNodeMenuComponent,
		SearchNodesFormComponent,
		SearchNodesDetailsComponent,
		RoundButtonComponent,
		SnackbarComponent,
		SearchEdgesFormComponent,
		SearchEdgesDetailsComponent,
		GraphTooltipComponent,
		NavigationComponent,
		FaqComponent,
		LoginComponent,
		NotFoundComponent,
		LayoutSelectorComponent
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
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptorService,
			multi: true
		}
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
