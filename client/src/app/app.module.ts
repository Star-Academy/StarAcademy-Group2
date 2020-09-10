import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphComponent } from './pages/graph/graph.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
	declarations: [ AppComponent, GraphComponent, TooltipComponent, HeaderComponent, FooterComponent ],
	imports: [ BrowserModule, AppRoutingModule, FormsModule ],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
