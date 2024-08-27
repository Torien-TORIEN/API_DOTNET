import { Menu } from "./menu.model";

export interface Profile {
    id: number;
    label: string;
    menus : Array<Menu>;
  }
  