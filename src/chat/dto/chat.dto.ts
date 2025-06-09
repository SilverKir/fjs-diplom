import { IsNotEmpty } from 'class-validator';

export class ChatDto {
  @IsNotEmpty()
  text: string;
}
