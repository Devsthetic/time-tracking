import { AppComponent } from './app.component';
import { LoginComponent } from '@components/login/login.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { CalendarComponent } from '@components/calendar/calendar.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { ReportComponent } from '@components/report/report.component';
import { DayPipe } from '@pipes/day.pipe';
import { MenuComponent } from '@components/menu/menu.component';
import { TableComponent } from '@components/table/table.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { TimeEntryComponent } from '@components/time-entry/time-entry.component';
import { TimeComponent } from '@components/time/time.component';
import { MapComponent } from '@components/map/map.component';

export const AppDeclarations: any[] = [
    AppComponent,
    LoginComponent,
    NavigationComponent,
    CalendarComponent,
    ProfileComponent,
    ReportComponent,
    DayPipe,
    MenuComponent,
    TableComponent,
    DialogComponent,
    TimeEntryComponent,
    TimeComponent,
    MapComponent,
];

export const EntryComponents: any[] = [DialogComponent];
