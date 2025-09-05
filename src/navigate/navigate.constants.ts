import { INavigation } from './interface/INavigation';

export const UNAUTORIZED_NAV: INavigation[] = [
  { id: 1, name: 'Войти', link: '/login', action: true },
  { id: 2, name: 'Зарегистрироваться', link: '/register', action: true },
  { id: 3, name: 'Поиск номеров', link: '/hotel-rooms', action: true },
  { id: 4, name: 'Комнаты', link: '/hotel-room/:id', action: false },
];

export const CLIENT_NAV: INavigation[] = [
  { id: 1, name: 'Поиск номеров', link: '/hotel-rooms', action: true },
  { id: 2, name: 'Брони', link: '/client/reservations', action: true },
  {
    id: 3,
    name: 'Обращения в поддержку',
    link: '/client/support-requests',
    action: true,
  },
  { id: 4, name: 'Комнаты', link: '/hotel-room/:id', action: false },
];

export const MANAGER_NAV: INavigation[] = [
  { id: 1, name: 'Cписок пользователей', link: '/manager/users', action: true },
  {
    id: 2,
    name: 'Обращения в поддержку',
    link: '/manager/support-requests',
    action: true,
  },
  {
    id: 3,
    name: 'Резервы у пользователя',
    link: '/manager/reservations/:id',
    action: false,
  },
];

export const ADMIN_NAV: INavigation[] = [
  { id: 1, name: 'Гостиницы', link: '/admin/hotels', action: true },
  { id: 2, name: 'Добавить гостиницу', link: '/admin/hotel', action: true },
  { id: 3, name: 'Cписок пользователей', link: '/admin/users', action: true },
  {
    id: 4,
    name: 'Добавить пользователя',
    link: '/admin/new_user',
    action: true,
  },
];
