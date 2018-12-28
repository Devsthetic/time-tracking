import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutes } from './routes';
import { AppProviders } from './providers';
import { AppImports } from './imports';
import { AppDeclarations, EntryComponents } from './declarations';
import { AppComponent } from './app.component';
import { PhonePipe } from './pipes/phone.pipe';



@NgModule({
  declarations: [ AppDeclarations, PhonePipe ],
  imports: [ AppImports ],
  providers: [ AppProviders ],
  bootstrap: [ AppComponent ],
  entryComponents: [ EntryComponents ]
})
export class AppModule { }
