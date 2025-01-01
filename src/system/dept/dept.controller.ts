import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ApiResult } from '../../common/decorators/api-result.decorator';
import { ResultData } from '../../common/utils/result';

import { DeptEntity } from './dept.entity';
import { DeptService } from './dept.service';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';

@ApiTags('部门模块')
@ApiBearerAuth()
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post()
  @ApiOperation({ summary: '부서 생성' })
  @ApiResult(DeptEntity)
  async create(@Body() dto: CreateDeptDto): Promise<ResultData> {
    return this.deptService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: '부서 변경' })
  @ApiResult()
  async update(@Body() dto: UpdateDeptDto): Promise<ResultData> {
    return this.deptService.update(dto);
  }

  @Get('list')
  @ApiOperation({ summary: '조회 부서 목록' })
  @ApiResult(DeptEntity, true)
  async find(): Promise<ResultData> {
    return this.deptService.find();
  }

  @Delete(':id')
  @ApiOperation({ summary: '부서 삭제' })
  @ApiResult()
  async delete(@Param('id') id: string): Promise<ResultData> {
    return this.deptService.delete(id);
  }
}
