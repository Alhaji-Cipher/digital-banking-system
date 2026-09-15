import { IsString, Length, IsNotEmpty } from 'class-validator';

export class OnboardBvnDto {
  @IsString()
  @Length(11, 11)
  @IsNotEmpty()
  bvn: string;
}
