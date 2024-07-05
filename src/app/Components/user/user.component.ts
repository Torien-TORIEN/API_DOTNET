import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { User } from '../../Models/user.model';
import { UserService } from '../../Services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'password', 'actions'];
  dataSource!: MatTableDataSource<User>;

  users!: User[];
  buttonLabel = "Save";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers();
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

  getAllUsers() {
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

  onSubmit() {
    if (this.form.valid) {
      const {username, email, password} = this.form.value;

      // Add
      this.userService.addUser({username, email, password})
        .then(data => {
          console.log("adding user: ", data);
          this.form.reset();
          this.getAllUsers();
        })
        .catch(error => {
          console.log("Component user:", error);
        });
    }
  }

  deleteUser(id: number) {
    console.log("ID:", id);
    this.userService.deleteUser(id)
      .then(data => {
        console.log("deleting user");
        this.getAllUsers();
      })
      .catch(error => {
        console.log("deleting user", error);
      });
  }
}
