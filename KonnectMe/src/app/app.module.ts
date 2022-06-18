import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { JoiningPageComponent } from './joining-page/joining-page.component';
import { UsercardComponent } from './usercard/usercard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    JoiningPageComponent,
    UsercardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
