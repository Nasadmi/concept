import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { UserEntity } from 'src/entities/user.entity';

export class MarkmapDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  user: UserEntity;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  public: number;
}

export type UpdateMarkmapDto = Partial<MarkmapDto>;

export type MarkmapUserId = Pick<UserEntity, 'id'>;
