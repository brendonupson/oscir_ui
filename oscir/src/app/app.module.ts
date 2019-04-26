

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import {
  FooterComponent,
  MenuComponent,
  HeaderComponent,
  SharedModule
} from './shared'; 
import { HelpModule } from './help/help.module';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { CustomMaterialModule } from './custom-material.module';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent, FooterComponent, HeaderComponent, MenuComponent
  ],
  imports: [    
    BrowserModule,
    BrowserAnimationsModule,

    CustomMaterialModule,

    CoreModule,
    SharedModule,    
    AppRoutingModule,    
  ],  
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
