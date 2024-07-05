import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../Services/login.service';
import { Router, RouterModule } from '@angular/router';;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatSidenavModule,MatCardModule,MatFormFieldModule,MatButtonModule,ReactiveFormsModule,MatInputModule,RouterModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required,Validators.minLength(2)]),
    password: new FormControl('', [Validators.required,Validators.minLength(2)]),
  });

  error!:string;


  constructor(private loginService :LoginService, private router :Router){}

  submit() {
    if (this.form.valid) {
      this.error="";
      this.loginService.login(this.form.value.username, this.form.value.password)
      .then( data =>{
        console.log("login :", data);
        this.form.reset();
        this.router.navigate(["/websocket/inbox"]);

      })
      .catch(error => {
        console.log(error);
        this.error=error;
      })
    }
  }

}
