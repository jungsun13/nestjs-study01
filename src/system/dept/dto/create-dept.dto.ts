import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateDeptDto {
  @ApiProperty({ description: '상급 부서. id' })
  @IsString({ message: 'parentId 타입 오류, 올바른 타입 string' })
  @IsNotEmpty({ message: 'parentId 비워 둘 수 없음' })
  readonly parentId: string;

  @ApiProperty({ description: '부서명' })
  @IsString({ message: 'name 형식 오류, 올바른 형식 string' })
  @IsNotEmpty({ message: 'name은 비워둘 수 없음' })
  @MinLength(2, { message: '부서명 최소 2자' })
  @MaxLength(50, { message: '부서명 최대 50자' })
  readonly name: string;

  @ApiProperty({ description: '부문장' })
  @IsString({ message: 'leader 타입 오류, 올바른 타입 string' })
  @IsNotEmpty({ message: 'leader' })
  readonly leader: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString({ message: 'remark 타입 오류, 올바른 타입 string' })
  @IsOptional()
  remark?: string;

  @ApiProperty({ description: '정렬' })
  @IsNumber({}, { message: 'orderNum 형식 오류, 올바른 형식 number' })
  @Min(0)
  readonly orderNum: number;
}