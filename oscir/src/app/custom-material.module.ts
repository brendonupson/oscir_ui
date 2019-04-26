
import{MatNativeDateModule} from '@angular/material';
//MatMomentDateModule
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';


import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';

import {MatTabsModule} from '@angular/material/tabs';

import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

//import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';





import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  } from '@angular/material';

//import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const modules = [    
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    //MatGridListModule,
    MatDialogModule,
    MatSlideToggleModule
];


@NgModule({
  imports: [...modules],
  exports: [...modules]
})

export class CustomMaterialModule { }