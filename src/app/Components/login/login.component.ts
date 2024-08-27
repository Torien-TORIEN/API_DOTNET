import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';import { AuthService } from '../../Services/auth.service';
;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatSidenavModule,MatCardModule,MatFormFieldModule,MatButtonModule,ReactiveFormsModule,MatInputModule,RouterModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required,Validators.minLength(2)]),
    password: new FormControl('', [Validators.required,Validators.minLength(2)]),
  });

  error!:string;


  constructor(private authService :AuthService, private router :Router){}

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      this.router.navigate(["/lyout/inbox"]);
    }
  }

  submit() {
    if (this.form.valid) {
      this.error="";
      this.authService.login(this.form.value.username, this.form.value.password)
      .then( data =>{
        console.log("login :", data);
        this.form.reset();
        this.router.navigate(["/lyout/inbox"]);

      })
      .catch(error => {
        console.log(error);
        this.error=error;
      })
    }
  }
}
