export interface Menu extends itemMenu {
  children?: itemMenu[]
}

export interface itemMenu {
  title: string,
  url: string,
  ionicIcon?: string,
  canActivate?: boolean,
}
