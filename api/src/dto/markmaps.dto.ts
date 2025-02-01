import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class MarkmapDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID('1')
  user: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  public: number;
}
