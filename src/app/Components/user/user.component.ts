import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';

import { User } from '../../Models/user.model';
import { UserService } from '../../Services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../Services/profile.service';
import { Profile } from '../../Models/profile.model';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatMenuModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'password', 'profileName', 'actions'];
  dataSource!: MatTableDataSource<User>;

  users!: User[];
  profiles!: Profile[];
  buttonLabel = "Save";
  userEditId !: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  formUpdate: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    profileID: new FormControl('', [Validators.required]),
  });

  constructor(private userService: UserService, private profileService : ProfileService) {}

  ngOnInit(): void {
    this.getAllUsers();
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

  private getAllUsers() {
    this.userService.getAllUsers()
      .then(users => {
        this.users = users;
        this.dataSource = new MatTableDataSource(this.users);
        // Assurez-vous que paginator et sort sont initialisés après la création de dataSource
        if (this.paginator && this.sort) {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  private getAllProfiles(){
    this.profileService.getAllProfiles()
    .then((data : Profile[])=>{
      this.profiles = data;
    })
    .catch(err =>{
      console.log(err);
      
    })
  }

  onSubmit() {
      if(this.formUpdate.valid &&this.userEditId && this.userEditId!==0){
        //Edit
        const {username, email, profileID} = this.formUpdate.value;
        this.userService.updateUser(this.userEditId, {username, email, profileID})
          .then( data =>{
            this.form.reset();
            this.userEditId=0;
            this.getAllUsers();
          })
          .catch(error => {
            console.log(error)
          })
      }else if(this.form.valid) {
        //Add
        const {username, email, password} = this.form.value;
        this.userService.addUser({username, email, password})
          .then(data => {
            this.form.reset();
            this.getAllUsers();
          })
          .catch(error => {
            console.log(error);
          });
      }
    
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id)
      .then(data => {
        this.getAllUsers();
      })
      .catch(error => {
        console.log(error);
      });
  }

  selectUserToEdit(id :number){
    this.userEditId=0;
    const user = this.users.filter((user)=> (user.id==id))[0];
    if(user){
      this.userEditId=user.id;
      this.formUpdate.patchValue({
        username : user.username,
        email : user.email,
        profileID :user.profileId
      })
    }
  }
}
