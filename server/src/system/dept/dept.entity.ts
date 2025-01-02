import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
} from 'typeorm';
import { $enum } from 'ts-enum-util';

import { StatusValue } from '../../common/enums/common.enum';
@Entity('sys_dept')
export class DeptEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ApiProperty({ description: '상급부서 id' })
  @Column({ type: 'bigint', name: 'parent_id', comment: '상급부서 id' })
  parentId: string;

  @ApiProperty({ description: '부서명' })
  @Column({ type: 'varchar', length: 50, comment: '부서명' })
  name: string;

  @ApiProperty({ description: '상태', enum: $enum(StatusValue).getValues() })
  @Column({
    type: 'tinyint',
    default: StatusValue.NORMAL,
    comment: '부서상태, 1-유효, 0-사용불가',
  })
  status: StatusValue;

  @ApiProperty({ description: '정렬' })
  @Column({ name: 'order_num', type: 'int', comment: '정렬', default: 0 })
  orderNum: number;

  @ApiProperty({ description: '부문장' })
  @Column({ type: 'varchar', length: 50, comment: '부서장' })
  leader: string;

  @ApiProperty({ description: '비고' })
  @Column({ type: 'text', comment: '비고' })
  remark: string;

  @ApiProperty({ description: '작성 시간' })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_date',
    comment: '등록시간',
  })
  createDate: Date;
}