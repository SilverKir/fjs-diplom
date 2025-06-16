export interface MessageAnswer {
  id: string;
  createdAt: string;
  text: string;
  readAt: string;
  author: {
    id: string;
    name: string;
  };
}
