import { IsString, Length, IsNotEmpty } from 'class-validator';

export class OnboardNinDto {
  @IsString()
  @Length(11, 11)
  @IsNotEmpty()
  nin: string;
}
