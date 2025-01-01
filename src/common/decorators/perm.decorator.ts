import { SetMetadata } from '@nestjs/common'

/**
 * 인터페이스에서 권한 없는 접근을 허용함
 */
export const ALLOW_NO_PERM = 'allowNoPerm'

export const AllowNoPerm = () => SetMetadata(ALLOW_NO_PERM, true);
