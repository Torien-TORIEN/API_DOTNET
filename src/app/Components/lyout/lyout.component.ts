import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { User } from '../../Models/user.model';

import { AuthService } from '../../Services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-lyout',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    RouterOutlet,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatToolbarModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './lyout.component.html',
  styleUrl: './lyout.component.scss'
})
export class LyoutComponent implements OnInit {
  menus !:any;
  Me !: User;

  form: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
    confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  
  constructor(private router: Router, private authService : AuthService, private dialog: MatDialog,){}

  ngOnInit(): void {
    this.getUserLogged();
  }

  navigateToRoute(route: string) {
    this.router.navigate([route]);
  }

  getUserLogged(){
    const user = this.authService.getUserLogged();
    if(user){
      this.Me=user;
      this.menus= this.Me.profile? this.Me.profile.menus : [];
      console.log("Menus user :", this.menus);
      
    }else{
      this.authService.logout();
    }
  }

  logout(){
    this.authService.logout();
  }

  openResetPasswordModal(){

  }

  /*
    Open dialog
  */
  openDialogWithRef(ref: TemplateRef<any>) {
    const dialogRef = this.dialog.open(ref);
  }

  onSubmit(){
    if(this.form.valid){
      console.log("Value : ", this.form.value);
    }
    console.log("Value : ", this.form.value);
  }
}
