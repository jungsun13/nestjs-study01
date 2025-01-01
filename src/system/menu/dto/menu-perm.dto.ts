import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { $enum } from 'ts-enum-util';

import { RouterMethods } from '../../../common/enums/routerMethod.enum'; 

export class MenuPermDto {
  @ApiProperty({
    description: 'api method 값 POST PUT GET DELETE',
    enum: $enum(RouterMethods).getValues(),
  })
  @IsString({ message: 'apiMethod 형식 오류' })
  @IsNotEmpty({ message: 'apiMethod 비워 둘 수 없음' })
  @IsIn($enum(RouterMethods).getValues())
  readonly apiMethod: RouterMethods;

  @ApiProperty({ description: 'api url' })
  @IsString({ message: 'apiUrl 형식 오류' })
  @IsNotEmpty({ message: 'apiUrl은 비워둘 수 없음' })
  readonly apiUrl: string;
}