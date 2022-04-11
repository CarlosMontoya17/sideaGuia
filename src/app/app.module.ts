import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es-MX';
import { NgxStripeModule } from 'ngx-stripe';
registerLocaleData(localeEs);
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { HistorialComponent } from './componentes/historial/historial.component';
import { PagosRecibidosComponent } from './componentes/pagos-recibidos/pagos-recibidos.component';
import { PagarComponent } from './componentes/pagar/pagar.component';
import { PanelComponent } from './componentes/panel/panel.component';
import { PublicidadComponent } from './componentes/publicidad/publicidad.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ActaManualComponent } from './componentes/acta-manual/acta-manual.component';
import { AgGridModule } from 'ag-grid-angular';
import { HistorialSideaComponent } from './componentes/historial-sidea/historial-sidea.component';

const config: SocketIoConfig = {
  url: environment.wsUrl, options: {}
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    SidebarComponent,
    HistorialComponent,
    PagosRecibidosComponent,
    PagarComponent,
    PanelComponent,
    PublicidadComponent,
    ActaManualComponent,
    HistorialSideaComponent,
  ],
  imports: [
    PdfViewerModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgxStripeModule.forRoot('pk_live_51JDzkADEhii25pFf1fnYoXRUeo94eyJxLtlYcWmciiJd0yRQAw4k1vYgPoPUlZ4g6YA6KynWsrNsMzUMtEChj1TA00erBAqnKB'),
    SocketIoModule.forRoot(config),
    AgGridModule.withComponents([]),

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-MX' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
