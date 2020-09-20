import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GraphComponent } from './pages/graph/graph.component';
import { FaqComponent } from './pages/faq/faq.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
	{ path: '', redirectTo: 'graph', pathMatch: 'full' },
	{ path: 'graph', component: GraphComponent },
	{ path: 'faq', component: FaqComponent },
	{ path: 'login', component: LoginComponent },
	{ path: '404', component: NotFoundComponent },
	{ path: '**', redirectTo: '/404' }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
