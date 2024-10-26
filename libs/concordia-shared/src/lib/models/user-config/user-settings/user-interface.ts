export interface IUserInterface {
  theme: string;
  items_per_page: number;
  display_density: string;
  language: string;
  user_menu_position: string;
  notify_sound: string;
  logo: string;
  home_background: string;
}

export class UserInterface {
  theme: string;
  itemsPerPage: number;
  displayDensity: string;
  language: string;
  userMenuPosition: string;
  notifySound: string;
  logo: string;
  homeBackground: string;

  public constructor(params: IUserInterface) {
    this.theme = params.theme;
    this.itemsPerPage = params.items_per_page;
    this.displayDensity = params.display_density;
    this.language = params.language;
    this.userMenuPosition = params.user_menu_position;
    this.notifySound = params.notify_sound;
    this.logo = params.logo;
    this.homeBackground = params.home_background;
  }
}
