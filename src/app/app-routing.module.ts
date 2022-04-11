import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { HistorialComponent } from './componentes/historial/historial.component';
import { PagosRecibidosComponent } from './componentes/pagos-recibidos/pagos-recibidos.component';
import { PagarComponent } from './componentes/pagar/pagar.component';
import { PanelComponent } from './componentes/panel/panel.component';
import { PublicidadComponent } from './componentes/publicidad/publicidad.component';
import { ActaManualComponent } from './componentes/acta-manual/acta-manual.component';
import { HistorialSideaComponent } from './componentes/historial-sidea/historial-sidea.component';
const routes: Routes = [{
  path: '',
  redirectTo: 'login',
  pathMatch: 'full'
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'inicio',
  component: InicioComponent
},
{
  path: 'historial',
  component: HistorialComponent
},
{
  path: 'pagos',
  component: PagosRecibidosComponent
},
{
  path: 'pagar',
  component: PagarComponent
},
{
  path: 'panel',
  component: PanelComponent
},
{
   path: 'publicidad',
   component: PublicidadComponent
},
{ 
  path: 'actaManual', 
  component: ActaManualComponent
},
{ 
  path: 'historial-sidea', 
  component: HistorialSideaComponent 
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
