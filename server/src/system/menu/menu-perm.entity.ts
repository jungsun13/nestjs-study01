import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sys_menu_perm')
export class MenuPermEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: string;

  @ApiProperty({ description: '메뉴 id' })
  @Column({ type: 'bigint', name: 'menu_id', comment: '메뉴 id' })
  public menuId: string;

  @ApiProperty({ description: 'api 경로' })
  @Column({
    name: 'api_url',
    comment:
      '이 메뉴에서 사용할 수 있는 API 인터페이스는 이 프로그램의 인터페이스여야 합니다. 그렇지 않으면 설정되지 않습니다',
  })
  public apiUrl: string;

  @ApiProperty({ description: 'api 方法' })
  @Column({
    name: 'api_method',
    comment: '이 메뉴가 API 인터페이스를 호출할 수 있는 method 메서드',
  })
  public apiMethod: string;
}