import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user.model';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Menu } from '../Models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private keyProfileMenus = "profileMenus";
  private canGetProfileMenu !:boolean;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  intializeProfileMenus(menus: Menu[]) {
    const localStorage = this.document.defaultView?.localStorage;
    localStorage?.setItem(this.keyProfileMenus, JSON.stringify(menus));
  }

  getProfileMenus(): Menu[] | null {
    const localStorage = this.document.defaultView?.localStorage;
    const menus = localStorage?.getItem(this.keyProfileMenus);
    return menus ? JSON.parse(menus) : null;
  }

  addMenuInProfileMenus(menu: Menu) {
    const localStorage = this.document.defaultView?.localStorage;
    const menus = this.getProfileMenus() || [];
    
    // Vérifier si le menu existe déjà
    const menuExists = menus.some(existingMenu => existingMenu.id === menu.id);
    if (!menuExists) {
      menus.push(menu);
      localStorage?.setItem(this.keyProfileMenus, JSON.stringify(menus));
    }
  }
  
  addMenusInProfileMenus(menus: Menu[]) {
    const localStorage = this.document.defaultView?.localStorage;
    const currentMenus = this.getProfileMenus() || [];
    
    // Filtrer les menus pour ne pas ajouter de doublons
    const newMenus = menus.filter(menu => 
      !currentMenus.some(existingMenu => existingMenu.id === menu.id)
    );
    
    const updatedMenus = [...currentMenus, ...newMenus];
    localStorage?.setItem(this.keyProfileMenus, JSON.stringify(updatedMenus));
  }
  

  clearMenuProfile() {
    const localStorage = this.document.defaultView?.localStorage;
    localStorage?.removeItem(this.keyProfileMenus);
  }

  activeCanGetProfileMenu(){
    this.canGetProfileMenu=true;
  }

  deactiveCanGetProfileMenu(){
    this.canGetProfileMenu=false;
  }

  canGetProfileMenus(){
    return this.canGetProfileMenu===true;
  }
}
