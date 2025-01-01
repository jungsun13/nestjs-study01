import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DeptEntity } from './dept.entity';
import { CreateDeptDto } from './dto/create-dept.dto';
import { ResultData } from '../../common/utils/result';
import { plainToInstance } from 'class-transformer';
import { AppHttpCode } from '../../common/enums/code.enum';
import { UpdateDeptDto } from './dto/update-dept.dto';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(DeptEntity)
    private readonly deptRepo: Repository<DeptEntity>,
    @InjectEntityManager()
    private readonly deptManager: EntityManager;
  ) {}

/** 부서 만들기 */
  async create (dto: CreateDeptDto): Promise<ResultData> {
    // 상위부서 존재여부 조회
    if (dto. parentId ! == '0') {
      const existing = await this.deptRepo.findOne({ where: { parentId: dto.parentId } });
      if (!existing) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '상급부서가 존재하지 않거나 삭제되었으니 수정 후 다시 추가해주세요');
    }
    const dept = plainToInstance(DeptEntity, dto);
    const res = await this. deptManager. transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<DeptEntity>(dept);
    })
    if (!res) ResultData.fail(AppHttpCode.SERVICE_ERROR, '작성에 실패했습니다, 잠시 후 다시 시도하십시오');
    return ResultData.ok(res);
  }

  /** 업데이트 부서 */
  async update (dto: UpdateDeptDto): Promise<ResultData> {
    const existing = await this.deptRepo.findOne({ where: { id: dto.id } });
    if (!existing) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '부서가 존재하지 않거나 삭제되었으니 수정 후 다시 추가해주세요');
    const { affected } = await this. deptManager. transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<DeptEntity>(DeptEntity, dto.id, dto);
    })
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '업데이트에 실패했으니 잠시 후 시도해주세요');
    return ResultData.ok();
  }

  /** 부서 삭제 */
  async delete (id: string): Promise<ResultData> {
    const existing = await this.deptRepo.findOne({ where: { id } });
    if (!existing) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '부서가 존재하지 않거나 삭제되었습니다');
    const { affected } = await this.deptManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete<DeptEntity>(DeptEntity, { parentId: id });
      return await transactionalEntityManager.delete<DeptEntity>(DeptEntity, id);
    });
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '부서삭제 실패, 잠시 후 시도해주세요');
    return ResultData.ok();
  }

  /** 모든부서 조회 */
  async find (): Promise<ResultData> {
    const depts = await this.deptRepo.find();
    return ResultData.ok(depts);
  }

}