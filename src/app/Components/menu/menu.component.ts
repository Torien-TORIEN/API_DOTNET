import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { ActivatedRoute } from '@angular/router';
import { Menu } from '../../Models/menu.model';
import { MenuService } from '../../Services/menu.service';
import { Location } from '@angular/common';
import { ProfileService } from '../../Services/profile.service';
import { Profile } from '../../Models/profile.model';
import { LocalStorageService } from '../../Services/locatStorage.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatFormFieldModule, MatCheckboxModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  menus !: Menu[];
  displayedColumns: string[] = ['id', 'label',"path","readOnly","actions"];
  dataSource!: MatTableDataSource<Menu>;
  menuEditId !:number;
  profileEditId !: number;

  selectedMenus: Menu[] = [];  // Liste des menus sélectionnés
  selectMode: boolean = false;  // Mode sélection activé par défaut

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  form: FormGroup = new FormGroup({
    label: new FormControl('', [Validators.required, Validators.minLength(2)]),
    path: new FormControl('', [Validators.required, Validators.minLength(2)]),
    isReadOnly: new FormControl(false),
  });

  constructor(
    private menuService  : MenuService,
    private profileService : ProfileService,
    private route: ActivatedRoute,
    private location: Location,
    private localStorageService : LocalStorageService
  ){}

  ngOnInit(){
    this.route.url.subscribe(url => {
      this.selectMode = url.some(segment => segment.path === 'select');
      if(this.selectMode){
        this.route.paramMap.subscribe(params => {
          const idParam = params.get('id');
          if (idParam !== null) {
            this.profileEditId = Number(idParam); // Conversion en nombre
          }
        });
      }
    });

    this.getAllMenus();
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

  private getAllMenus(){
    this.menuService.getAllMenus()
    .then((data : Menu[])=>{
      this.menus = data;

      if(this.selectMode==true && this.profileEditId){
        this.getMenuNotInProfile();
      }else{
        this.dataSource = new MatTableDataSource(this.menus);
      }

      // Assurez-vous que paginator et sort sont initialisés après la création de dataSource
      if (this.paginator && this.sort && this.dataSource) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      
    })
    .catch(err =>{
      console.log(err);
      
    })
  }

  deleteMenu(id :number){
    this.menuService.deleteMenu(id)
      .then(data =>{
        this.getAllMenus();
        
      })
      .catch(error=>{
        console.log(error);
        
      })
  }

  selectMenuToEdit(id : number){
    this.menuEditId=0;
    const menu = this.menus.filter((menu)=> (menu.id==id))[0];
    if(menu){
      this.menuEditId=menu.id;
      this.form.patchValue({
        label : menu.label,
        path : menu.path,
        isReadOnly :menu.isReadOnly
      })
    }
  }

  onSubmit(){
    if(this.form.valid){
      const value = this.form.value;
      if(this.menuEditId && this.menuEditId !=0){
        //UPDATE
        this.menuService.updateMenu(this.menuEditId, value)
          .then(data =>{
            this.menuEditId = 0;
            this.form.reset();
            this.getAllMenus();
          })
          .catch(error=>{
            console.log(error);
          })
      }else{
        //CREATE
        this.menuService.addMenus(value)
        .then(data => {
          this.form.reset();
          this.getAllMenus();
        })
        .catch(error=>{
          console.log(error);
        })
      }
    }
  }

  toggleMenuSelection(menu: Menu) {
    if (this.selectedMenus.includes(menu)) {
      this.selectedMenus = this.selectedMenus.filter(m => m.id !== menu.id);
    } else {
      this.selectedMenus.push(menu);
    }
  }

  validateSelection() {
    if(this.selectedMenus && this.selectedMenus.length>0){
      this.localStorageService.addMenusInProfileMenus(this.selectedMenus);
      this.localStorageService.activeCanGetProfileMenu();
    }
    this.location.back();
  }

  //Recuper qui ne sont pas encore affectée à profile à modifier
  getMenuNotInProfile(){
    this.profileService.getProfileById(this.profileEditId)
      .then((profile : Profile)=>{
        const profileMenus = profile.menus;

        // Filtrer les menus qui ne sont pas dans profileMenus
      const menusNotInProfile = this.menus.filter(menu => 
        !profileMenus.some(profileMenu => profileMenu.id === menu.id)
      );

      this.dataSource = new MatTableDataSource(menusNotInProfile);

      // Assurez-vous que paginator et sort sont initialisés après la création de dataSource
      if (this.paginator && this.sort && this.dataSource) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      
      })
      .catch(error=>{
        console.log(error);
        
      })
  }

}
