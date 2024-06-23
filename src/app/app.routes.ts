import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PdfPageComponent } from './pages/pdf-page/pdf-page.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'descargar', component: PdfPageComponent }
];
