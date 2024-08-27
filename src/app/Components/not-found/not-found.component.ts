import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ROUTES_CONSTANTS } from '../../../assets/utils/constants/routes.constant';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule, MatCardModule,],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

  title : string="PAGE NOT FOUND";
  errorAccessDinied !: boolean;
  constructor(private router :Router, private route : ActivatedRoute){
  }

  ngOnInit(){
    this.route.url.subscribe(url => {
      this.errorAccessDinied  = url.some(segment => segment.path === 'access-denied');
    });
  }

  navigateToHome() {
    this.router.navigate([ROUTES_CONSTANTS.INBOX]);
  }

}
