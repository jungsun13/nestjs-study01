import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsNumberString,
  IsIn,
  MinLength,
  MaxLength,
} from 'class-validator';
import { $enum } from 'ts-enum-util';

import { StatusValue } from '../../../common/enums/common.enum';

export class UpdateDeptDto {
  @ApiProperty({ description: 'id' })
  @IsNumberString({}, { message: 'id 타입 오류, 올바른 타입 string' })
  id: string;

  @ApiProperty({ description: '上级部门 id', required: false })
  @IsNumberString({}, { message: 'parentId 타입 오류, 올바른 타입 string' })
  @IsOptional()
  parentId?: string;

  @ApiProperty({ description: '部门名称', required: false })
  @IsString({ message: 'name 형식 오류, 올바른 형식 string' })
  @MinLength(2, { message: '계정 최소 2자' })
  @MaxLength(50, { message: '계정 최대 50자' })
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '部门负责人', required: false })
  @IsString({ message: 'leader 타입 오류, 올바른 타입 string' })
  @IsOptional()
  readonly leader?: string;
;
  @ApiProperty({ description: '备注', required: false })
  @IsString({ message: 'remark 타입 오류, 올바른 타입 string' })
  @IsOptional()
  readonly remark?: string;

  @ApiProperty({
    description: '상태',
    enum: $enum(StatusValue).getValues(),
    required: false,
  })
  @IsNumber({}, { message: 'status 형식 오류, 올바른 형식 number' })
  @IsIn($enum(StatusValue).getValues())
  @IsOptional()
  status?: StatusValue;

  @ApiProperty({ description: '정렬', required: false })
  @IsNumber({}, { message: 'orderNum 형식 오류, 올바른 형식 number' })
  @Min(0)
  @IsOptional()
  orderNum?: number;
}
