import { ApiProperty } from '@nestjs/swagger';

export class ReqListQuery {
  @ApiProperty({ description: '페이지 수 보이기' })
  page: number;

  @ApiProperty({ description: '페이지당 갯수 보이기' })
  size: number;
}
