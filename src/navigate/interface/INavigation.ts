export interface INavigation {
  id: number;
  name: string;
  link?: string | INavigation[];
}
