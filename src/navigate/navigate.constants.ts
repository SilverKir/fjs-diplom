import { INavigation } from './interface/INavigation';

export const UNAUTORIZED_NAV: INavigation[] = [
  { id: 1, name: 'Войти', link: '/login' },
  { id: 2, name: 'Зарегистрироваться', link: '/register' },
  { id: 3, name: 'Поиск номеров', link: '/hotel-rooms' },
];

export const CLIENT_NAV: INavigation[] = [
  { id: 1, name: 'Поиск номеров', link: '/hotel-rooms' },
  { id: 2, name: 'Брони', link: '/client/reservations' },
  { id: 3, name: 'Обращения в поддержку', link: '/client/support-requests' },
];

export const MANAGER_NAV: INavigation[] = [
  { id: 1, name: 'Поиск номеров', link: '/hotel-rooms' },
  { id: 2, name: 'Cписок пользователей', link: '/manager/users' },
  { id: 3, name: 'Обращения в поддержку', link: '/manager/support-requests' },
];

export const ADMIN_NAV: INavigation[] = [
  { id: 1, name: 'Гостиницы', link: '/admin/hotels' },
  { id: 2, name: 'Cписок пользователей', link: '/admin/users' },
];
