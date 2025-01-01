import {
  CanActivate,
  Inject,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { pathToRegexp } from 'path-to-regexp';

import { ALLOW_ANON } from '../decorators/allow-anon.decorator';
import { ALLOW_NO_PERM } from '../decorators/perm.decorator';

import { PermService } from '../../system/perm/perm.service';
import { UserType } from '../enums/common.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private globalWhiteList = [];
  constructor(
    private readonly reflector: Reflector,
    @Inject(PermService)
    private readonly permService: PermService,
    private readonly config: ConfigService,
  ) {
    this.globalWhiteList = [].concat(
      this.config.get('perm.router.whitelist') || [],
    );
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 일단 토큰이 없는 건 비교 권한이 필요 없는 거고
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [ctx.getHandler(), ctx.getClass()]);
    if (allowAnon) return true;
   // 전역 설정
    const req = ctx.switchToHttp().getRequest()

    const i = this.globalWhiteList.findIndex((route) => {
      // 요청 방법 유형이 동일합니다
      if (req.method.toUpperCase() === route.method.toUpperCase()) {
        // 비교 URL
        return !!pathToRegexp(route.path).exec(req.url);
      }
      return false;
    });
    // 화이트리스트에서 다음 단계를 진행합니다. i === -1은 화이트리스트에 없습니다. 현재 인터페이스 권한이 있는지 비교해야 합니다
    if (i > -1) return true;
    // 함수 요청 헤더 설정AllowNoPerm 데코레이터 권한 검증 필요 없음
    const allowNoPerm = this.reflector.getAllAndOverride<boolean>(ALLOW_NO_PERM, [ctx.getHandler(), ctx.getClass()])
    if (allowNoPerm) return true;

    // 이 사용자가 가지고 있는 인터페이스 권한과 비교해야 합니다
    const user = req.user;
    // token 없이 바로 가기 false
    if (!user) return false;
    // 오버튜브
    if (user.type === UserType.SUPER_ADMIN) return true;

    const userPermApi = await this.permService.findUserPerms(user.id);
    const index = userPermApi.findIndex((route) => {
      // 요청 방법 유형이 동일합니다
      if (req.method.toUpperCase() === route.method.toUpperCase()) {
        // 비교 url
        const reqUrl = req.url.split('?')[0];
        return !!pathToRegexp(route.path).exec(reqUrl);
      }
      return false;
    });
    if (index === -1) throw new ForbiddenException('您无权限访问该接口')
    return true;
  }
}
