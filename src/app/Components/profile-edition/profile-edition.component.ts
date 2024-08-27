import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileService } from '../../Services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../../Models/profile.model';
import { error } from 'console';
import { Menu } from '../../Models/menu.model';
import { LocalStorageService } from '../../Services/locatStorage.service';

@Component({
  selector: 'app-profile-edition',
  standalone: true,
  imports: [MatTabsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './profile-edition.component.html',
  styleUrl: './profile-edition.component.scss'
})
export class ProfileEditionComponent {
  profileEditId ! : number;
  profile !: Profile;

  menus !: Menu[];
  displayedColumns: string[] = ['id', 'label',"path","readOnly","actions"];
  dataSource!: MatTableDataSource<Menu>;

  form: FormGroup = new FormGroup({
    label: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  constructor(
    private profileService : ProfileService,
    private route : ActivatedRoute,
    private router : Router,
    private localStorageService : LocalStorageService
  ){
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.profileEditId = Number(idParam); // Conversion en nombre
      }
    });
  }

  ngOnInit(){
    this.getProfileById();
  }

  onSubmit(){
    if(this.form.valid && this.profileEditId){
      const value =this.form.value;

      console.log("value :",value );
      
    }
  }

  ngOnDestroy(){
    this.localStorageService.deactiveCanGetProfileMenu();
  }

  private getProfileById(){
    if(this.profileEditId){
      this.profileService.getProfileById(this.profileEditId)
        .then((data: Profile)=>{
          this.profile=data;

          if(this.localStorageService.canGetProfileMenus()){
            this.menus = this.localStorageService.getProfileMenus() || [];
          }else{
            this.menus = this.profile.menus
          }
          this.form.patchValue({label : this.profile.label})
          this.dataSource = new MatTableDataSource(this.menus);
        })
        .catch(error=>{
          console.log(error);
          
        })
    }
  }

  removeMenuFromProfile(id: number) {
    // Trouver l'index du menu avec l'ID spécifié
    const index = this.menus.findIndex(menu => menu.id === id);
  
    // Vérifier si l'élément existe
    if (index !== -1) {
      // Retirer l'élément de la liste
      this.menus.splice(index, 1);
  
      // Mettre à jour le dataSource pour le tableau
      this.dataSource = new MatTableDataSource(this.menus);
    }
  }

  addMenus(){
    this.localStorageService.intializeProfileMenus(this.menus);
    this.router.navigate([`/lyout/menus/select/${this.profileEditId}`]);
  }

  updateProfile() {
    if (this.form.valid) {
      const label = this.form.value.label;
  
      // Récupérer les IDs des menus sélectionnés depuis this.menus
      const menuIds = this.menus?.map(menu => menu.id);
  
      // Créer l'objet profil à envoyer à l'API
      const profile = {
        label: label,
        menusIds: menuIds
      };
  
      // Appeler la méthode updateProfileMenus
      this.profileService.updateProfileMenus(this.profileEditId, profile)
        .then(response => {
          this.form.reset();
          this.localStorageService.clearMenuProfile();
          this.router.navigate(["/lyout/profiles"])
        })
        .catch(error => {
          console.error('Error while updating profile', error);
        });
    }
  }
  
}
