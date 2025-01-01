import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsString,
  Min,
  IsNotEmpty,
  Length,
  IsNumberString,
} from 'class-validator';
import { $enum } from 'ts-enum-util';

import { MenuType } from '../../../common/enums/common.enum';

import { MenuPermDto } from './menu-perm.dto';
export class CreateMenuDto {
  @ApiProperty({ description: '부모 메뉴' })
  @IsNumberString({}, { message: 'parent 类型错误' })
  @IsNotEmpty({ message: 'parentId 필수 입력값' })
  readonly parentId: string;

  @ApiProperty({ description: '메뉴명' })
  @IsString()
  @Length(2, 20, { message: 'name 문자 길이 2~20' })
  readonly name: string;

  @ApiProperty({ description: '메뉴 고유표시, 프론트 컨트롤 페이지 은닉' })
  @IsString({ message: 'code 타입 오류, 올바른 타입 string' })
  readonly code: string;

  @ApiProperty({
    description: '메뉴타입 1-메뉴/카탈로그 2-tabs 3- 버튼',
    enum: $enum(MenuType).getValues(),
    required: false,
  })
  @IsNumber({}, { message: 'type 형식 오류' })
  @IsIn($enum(MenuType).getValues(), {
    message: 'type의 값은 1/2/3이며 각각 메뉴/tabs/버튼',
  })
  readonly type: MenuType;

  @ApiProperty({ description: '排序', required: false })
  @IsNumber({}, { message: '정렬 전송 오류' })
  @Min(0)
  readonly orderNum: number;

  @ApiProperty({ description: '메뉴 인터페이스 경로 권한' })
  @IsArray({ message: '메뉴 권한은 배열 형식' })
  readonly menuPermList: MenuPermDto[];
}