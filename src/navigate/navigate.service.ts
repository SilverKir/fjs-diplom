import { Injectable } from '@nestjs/common';
import { IAuthNav } from './interface/IAuthNav';
import {
  ADMIN_NAV,
  CLIENT_NAV,
  MANAGER_NAV,
  UNAUTORIZED_NAV,
} from './navigate.constants';

@Injectable()
export class NavService {
  getNavigation(role: string): IAuthNav {
    switch (role) {
      case 'admin':
        return {
          isAuth: true,
          nav: ADMIN_NAV,
        };
      case 'client':
        return {
          isAuth: true,
          nav: CLIENT_NAV,
        };
      case 'manager':
        return {
          isAuth: true,
          nav: MANAGER_NAV,
        };
      default:
        return {
          isAuth: false,
          nav: UNAUTORIZED_NAV,
        };
    }
  }
}
