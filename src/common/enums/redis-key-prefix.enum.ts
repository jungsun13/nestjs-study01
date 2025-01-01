/**
 * 모듈별 기능에 대한 redis 접두사, 일반 + id
 * 사양은 module:subModule:id 형식을 사용하는 것이 좋습니다
 */
export enum RedisKeyPrefix {
  USER_INFO = 'user:info:',
  USER_ROLE = 'user:role:',
  USER_MENU = 'user:menu:',
  USER_PERM = 'user:perm:',
}
