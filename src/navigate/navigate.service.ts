import { Injectable } from '@nestjs/common';
import { INavigation } from './interface/INavigation';
import {
  ADMIN_NAV,
  CLIENT_NAV,
  MANAGER_NAV,
  UNAUTORIZED_NAV,
} from './navigate.constants';

@Injectable()
export class NavService {
  getNavigation(role: string): INavigation[] {
    switch (role) {
      case 'admin':
        return ADMIN_NAV;
      case 'client':
        return CLIENT_NAV;
      case 'manager':
        return MANAGER_NAV;
      default:
        return UNAUTORIZED_NAV;
    }
  }
}
