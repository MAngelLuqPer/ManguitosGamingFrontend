export class MenuItem {
    constructor (
        public name: string,
        public route: string,
        public tip: string,
        public icon: string = '',
        public children: MenuItem[] = [],
        public foto?: string
    ) {}
}

export const menuList = [
    new MenuItem('Inicio', '/', 'Inicio', 'home'),

];