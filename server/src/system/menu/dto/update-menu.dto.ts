import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  Length,
  IsIn,
  Min,
  IsArray,
  IsOptional,
  IsNumberString,
} from 'class-validator';
import { $enum } from 'ts-enum-util';

import { MenuType } from '../../../common/enums/common.enum';

import { MenuPermDto } from './menu-perm.dto';
export class UpdateMenuDto {
  @ApiProperty({ description: '菜单id', required: false })
  @IsNumberString({}, { message: 'id 형식 오류' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '부모메뉴', required: false })
  @IsNumberString({}, { message: 'parentId 형식 오류' })
  @IsNotEmpty({ message: 'parentId 필수 입력값' })
  @IsOptional()
  readonly parentId?: number;

  @ApiProperty({ description: '메뉴명', required: false })
  @IsString({ message: 'name 형식 오류' })
  @Length(2, 20, { message: 'name 문자 길이 2~20' })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    description: '메뉴 고유표시, 프론트 컨트롤 페이지 은닉',
    required: false,
  })
  @IsString({ message: 'code 형식 오류' })
  @IsOptional()
  readonly code?: string;

  @ApiProperty({
    description: '메뉴타입 1-메뉴/카탈로그 2-tabs 3- 버튼',
    enum: $enum(MenuType).getValues(),
    required: false,
  })
  @IsNumber({}, { message: 'type 형식 오류' })
  @IsIn($enum(MenuType).getValues(), {
    message: 'type의 값은 1/2/3이며 각각 메뉴/tabs/버튼',
  })
  @IsOptional()
  readonly type?: MenuType;

  @ApiProperty({ description: '정렬', required: false })
  @IsNumber({}, { message: '정렬 전송 오류' })
  @Min(0)
  @IsOptional()
  readonly orderNum?: number;

  @ApiProperty({ description: '메뉴 인터페이스 권한' })
  @IsArray({ message: 'menuPerms 형식 오류' })
  menuPermList: MenuPermDto[];
}