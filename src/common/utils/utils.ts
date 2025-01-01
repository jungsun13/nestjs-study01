import { RedisKeyPrefix } from '../enums/redis-key-prefix.enum';

/**
 * 고유 ID와 모듈 접두사를 통합한 후 rediskey 가져오기
 * @param moduleKeyPrefix 모듈 접두사
 * @param ID 또는 고유 ID
 */
export function getRedisKey(
  moduleKeyPrefix: RedisKeyPrefix,
  id: string | number,
): string {
  return `${moduleKeyPrefix}${id}`;
}

/**
 * 대문자 벼환
 * @param str
 * @returns
 */
export function toCamelCase(str: string): string {
  return str.replace(/_(\w)/g, (_, c) => c.toUpperCase());
}

/**
 * 소문자 변환
 * @param str
 * @returns
 */
export function toUnderline(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * 대상 key 밑줄 긋기, 긋기 긋기
 * @param target 目标
 * @param targetType
 * @param cutStr 对象 key 裁剪字段
 * @returns
 */
export function objAttrToCamelOrUnderline(
  target: Record<string, any>,
  targetType: 'camelCase' | 'underline',
  cutStr?: string,
) {
  const _target = {};
  Object.keys(target).forEach((k) => {
    let _k = k;
    if (!!cutStr) {
      _k = _k.replace(cutStr, '');
    }
    _k = targetType === 'camelCase' ? toCamelCase(_k) : toUnderline(_k);
    _target[_k] = target[k];
  });

  return _target;
}
