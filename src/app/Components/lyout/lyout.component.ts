

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

import { LoginService } from '../../Services/login.service';

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
    MatToolbarModule
  ],
  templateUrl: './lyout.component.html',
  styleUrl: './lyout.component.scss'
})
export class LyoutComponent implements OnInit {
  menus !:any;
  Me !: User;
  constructor(private router: Router, private loginService : LoginService){}

  ngOnInit(): void {
    this.menus=[
      {name: "Users", route: "websocket/users"},
      {name: "Messages", route: "websocket/inbox"},
      {name: "Posts", route: "websocket/posts"},
    ]

    this.getUserLogged();
  }

  navigateToRoute(route: string) {
    this.router.navigate([route]);
  }

  getUserLogged(){
    const user = this.loginService.getUserLogged();
    if(user){
      this.Me=user;
    }else{
      this.loginService.logout();
    }
  }

  logout(){
    this.loginService.logout();
  }
}
