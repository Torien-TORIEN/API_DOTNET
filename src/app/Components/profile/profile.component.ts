import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProfileService } from '../../Services/profile.service';
import { Profile } from '../../Models/profile.model';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profiles !: Profile[];
  displayedColumns: string[] = ['id', 'label',"actions"];
  dataSource!: MatTableDataSource<Profile>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  form: FormGroup = new FormGroup({
    label: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  constructor(private profileService  : ProfileService, private router : Router){

  }

  ngOnInit(){
    this.getAllProfiles();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private getAllProfiles(){
    this.profileService.getAllProfiles()
    .then((data : Profile[])=>{
      this.profiles = data;

      this.dataSource = new MatTableDataSource(this.profiles);
      // Assurez-vous que paginator et sort sont initialisés après la création de dataSource
      if (this.paginator && this.sort) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      
    })
    .catch(err =>{
      console.log(err);
      
    })
  }

  deleteProfile(id :number){
    this.profileService.deleteProfile(id)
      .then(data =>{
        this.getAllProfiles();
        
      })
      .catch(error=>{
        console.log(error);
        
      })
  }

  selecProfileToEdit(id : number){
    this.router.navigate([`/lyout/profiles/${id}`]);
  }

  onSubmit(){
    if(this.form.valid){
      const label = this.form.value.label;
      this.profileService.addProfile(label)
        .then(data => {
          this.form.reset();
          this.getAllProfiles();
        })
      
        .catch(error=>{
          console.log(error);
          
        })
      
    }
  }
}
