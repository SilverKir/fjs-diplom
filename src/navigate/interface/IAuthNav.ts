import { INavigation } from './INavigation';

export interface IAuthNav {
  isAuth: boolean;
  role: string;
  nav: INavigation[];
}
