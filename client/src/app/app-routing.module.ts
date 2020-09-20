import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GraphComponent } from './pages/graph/graph.component';
import { FaqComponent } from './pages/faq/faq.component';

const routes: Routes = [
	{ path: '', redirectTo: 'graph', pathMatch: 'full' },
	{ path: 'graph', component: GraphComponent },
	{ path: 'faq', component: FaqComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
