import { SetMetadata } from '@nestjs/common';

export const ALLOW_ANON = 'allowAnon';
/**
 * 인터페이스가 토큰을 검사하지 않도록 하기
 */
export const AllowAnon = () => SetMetadata(ALLOW_ANON, true);
