import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { UserEntity } from 'src/entities/user.entity';
import { MarkmapEntity } from 'src/entities/markmap.entity';

export class StarsDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  user: Pick<UserEntity, 'id'>;

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  markmap: Pick<MarkmapEntity, 'id'>;
}
