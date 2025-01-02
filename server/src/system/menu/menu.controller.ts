import { Controller, Post, Body, Get, Put, Delete, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ApiResult } from '../../common/decorators/api-result.decorator';
import { ResultData } from '../../common/utils/result';

import { MenuService } from './menu.service';
import { MenuEntity } from './menu.entity';
import { MenuPermEntity } from './menu-perm.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@ApiTags('메뉴 및 메뉴권한관리')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('/all')
  @ApiOperation({ summary: '전체 메뉴' })
  @ApiResult(MenuEntity, true)
  async findAllMenu(@Query('hasBtn') hasBtn: 0 | 1): Promise<ResultData> {
    return await this.menuService.findAllMenu(!!hasBtn);
  }

  @Get('one/:parentId/btns')
  @ApiOperation({ summary: '조회된 메뉴 목록' })
  @ApiResult(MenuEntity, true)
  async findBtnByParentId(
    @Param('parentId') parentId: string,
  ): Promise<ResultData> {
    return await this.menuService.findBtnByParentId(parentId);
  }

  @Get('one/:id/menu-perm')
  @ApiOperation({ summary: '조회 메뉴 권한' })
  @ApiResult(MenuPermEntity, true)
  async findMenuPerms(@Param('id') id: string): Promise<ResultData> {
    return await this.menuService.findMenuPerms(id)
  }

  @Post()
  @ApiOperation({ summary: '메뉴 생성' })
  @ApiResult()
  async create(@Body() dto: CreateMenuDto): Promise<ResultData> {
    return await this.menuService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: '메뉴 변경' })
  @ApiResult()
  async updateMenu(@Body() dto: UpdateMenuDto): Promise<ResultData> {
    return await this.menuService.updateMenu(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '메뉴 삭제' })
  @ApiResult()
  async delete(@Param('id') id: string): Promise<ResultData> {
    return await this.menuService.deleteMenu(id);
  }
}
