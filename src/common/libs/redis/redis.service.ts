import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly client: Redis) {}

  getClient(): Redis {
    return this.client;
  }

  /* --------------------- string 相关 -------------------------- */

  /**
   *
   * @param key 저장 key 값
   * @param val key 해당하는 val
   * @Param seconds 옵션, 만료시간, 단위초
   */
  async set(key: string, val: string, seconds?: number): Promise<'OK' | null> {
    if (!seconds) return await this.client.set(key, val);
    return await this.client.set(key, val, 'EX', seconds);
  }

  /**
   * 대응 value
   * @param key
   */
  async get(key: string): Promise<string> {
    if (!key || key === '*') return null;
    return await this.client.get(key);
  }

  async del(keys: string | string[]): Promise<number> {
    if (!keys || keys === '*') return 0;
    if (typeof keys === 'string') keys = [keys];
    return await this.client.del(...keys);
  }

  async ttl(key: string): Promise<number | null> {
    if (!key) return null;
    return await this.client.ttl(key);
  }

  /* ----------------------- hash ----------------------- */

  /**
   * hash 설정 key에서 단일 필드 value
   * @param key
   * @param field 속성
   * @param value 值
   */
  async hset(
    key: string,
    field: string,
    value: string,
  ): Promise<string | number | null> {
    if (!key || !field) return null;
    return await this.client.hset(key, field, value);
  }

  /**
   * hash 설정 key 아래의 여러 필드 value
   * @param key
   * @param data
   * @params expire 단위 초
   */
  async hmset(
    key: string,
    data: Record<string, string | number | boolean>,
    expire?: number,
  ): Promise<number | any> {
    if (!key || !data) return 0;
    const result = await this.client.hmset(key, data);
    if (expire) {
      await this.client.expire(key, expire);
    }
    return result;
  }

  /**
   * hash 단일 필드에 대한 value 가져오기
   * @param key
   * @param field
   */
  async hget(key: string, field: string): Promise<number | string | null> {
    if (!key || !field) return 0;
    return await this.client.hget(key, field);
  }

  /**
   * hash 모든 필드에 대한 key 가져오기 value
   * @param key
   */
  async hvals(key: string): Promise<string[]> {
    if (!key) return [];
    return await this.client.hvals(key);
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    return await this.client.hgetall(key);
  }

  /**
   * hash 삭제 key 다음 fields value
   * @param key
   * @param fields
   */
  async hdel(
    key: string,
    fields: string | string[],
  ): Promise<string[] | number> {
    if (!key || fields.length === 0) return 0;
    return await this.client.hdel(key, ...fields);
  }

  /**
   * hash 모든 fields value key 지우기
   * @param key
   */
  async hdelAll(key: string): Promise<string[] | number> {
    if (!key) return 0;
    const fields = await this.client.hkeys(key);
    if (fields.length === 0) return 0;
    return await this.hdel(key, fields);
  }

  /* -----------   list 상관조작 ------------------ */

  /**
   * 목록 길이 가져오기
   * @param key
   */
  async lLength(key: string): Promise<number> {
    if (!key) return 0;
    return await this.client.llen(key);
  }

  /**
   * 인덱스를 통한 목록 요소 값 설정
   * @param key
   * @param index
   * @param val
   */
  async lSet(key: string, index: number, val: string): Promise<'OK' | null> {
    if (!key || index < 0) return null
    return await this.client.lset(key, index, val);
  }

  /**
   * 인덱스를 통해 목록 요소 가져오기
   * @param key
   * @param index
   */
  async lIndex(key: string, index: number): Promise<string | null> {
    if (!key || index < 0) return null;
    return await this.client.lindex(key, index);
  }

  /**
   * 지정한 범위 내의 요소 가져오기
   * @param key
   * @param start 시작 위치, 0은 시작 위치
   * @param stop 종료 위치, -1 모든 것 되돌리기
   */
  async lRange(
    key: string,
    start: number,
    stop: number,
  ): Promise<string[] | null> {
    if (!key) return null;
    return await this.client.lrange(key, start, stop);
  }

  /**
   * 하나 이상의 값을 목록의 맨 위에 삽입합니다
   * @param key
   * @param val
   */
  async lLeftPush(key: string, ...val: string[]): Promise<number> {
    if (!key) return 0;
    return await this.client.lpush(key, ...val);
  }

  /**
   * 존재하는 목록의 맨 위에 하나 이상의 값을 삽입합니다
   * @param key
   * @param val
   */
  async lLeftPushIfPresent(key: string, ...val: string[]): Promise<number> {
    if (!key) return 0;
    return await this.client.lpushx(key, ...val);
  }

  /**
   * pivot이 존재하는 경우 pivot 앞에 추가하기
   * @param key
   * @param pivot
   * @param val
   */
  async lLeftInsert(key: string, pivot: string, val: string): Promise<number> {
    if (!key || !pivot) return 0;
    return await this.client.linsert(key, 'BEFORE', pivot, val);
  }

  /**
   * pivot이 존재하는 경우 pivot 뒤에 추가
   * @param key
   * @param pivot
   * @param val
   */
  async lRightInsert(key: string, pivot: string, val: string): Promise<number> {
    if (!key || !pivot) return 0;
    return await this.client.linsert(key, 'AFTER', pivot, val);
  }

  /**
   * 목록에 하나 이상의 값 추가하기
   * @param key
   * @param val
   */
  async lRightPush(key: string, ...val: string[]): Promise<number> {
    if (!key) return 0;
    return await this.client.lpush(key, ...val);
  }

  /**
   * 존재하는 목록에 값을 하나 이상 추가합니다
   * @param key
   * @param val
   */
  async lRightPushIfPresent(key: string, ...val: string[]): Promise<number> {
    if (!key) return 0;
    return await this.client.rpushx(key, ...val);
  }

  /**
   * 목록의 첫 번째 요소를 제거하고 가져오기
   * @param key
   */
  async lLeftPop(key: string): Promise<string> {
    if (!key) return null;
    const result = await this.client.blpop(key);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * 목록의 마지막 요소를 제거하고 가져오기
   * @param key
   */
  async lRightPop(key: string): Promise<string> {
    if (!key) return null;
    const result = await this.client.brpop(key);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * 목록을 트리밍(trim)합니다. 즉, 지정된 구간에 있는 요소만 남기고 지정된 구간에 없는 요소는 모두 삭제합니다.
   * @param key
   * @param start
   * @param stop
   */
  async lTrim(key: string, start: number, stop: number): Promise<'OK' | null> {
    if (!key) return null;
    return await this.client.ltrim(key, start, stop);
  }

  /**
   * 목록 요소 제거
   * @param key
   * @param count
   * count > 0 : 표의 머리부터 꼬리까지 검색하여 value와 같은 요소를 제거합니다.
   * count < 0 : count의 절대값인 value와 같은 요소를 제거하여 꼬리표부터 머리표까지 검색합니다.
   * count = 0: 테이블의 모든 value 값을 삭제합니다
   * @param val
   */
  async lRemove(key: string, count: number, val: string): Promise<number> {
    if (!key) return 0;
    return await this.client.lrem(key, count, val);
  }

  /**
   * 목록의 마지막 요소를 제거하고 다른 크림을 추가하고 되돌립니다
   * 목록에 요소가 없으면 대기 시간이 초과되거나 꺼낼 요소가 발견될 때까지 대기열을 차단합니다
   * @param sourceKey
   * @param destinationKey
   * @param timeout
   */
  async lPoplPush(
    sourceKey: string,
    destinationKey: string,
    timeout: number,
  ): Promise<string> {
    if (!sourceKey || !destinationKey) return null;
    return await this.client.brpoplpush(sourceKey, destinationKey, timeout);
  }
}
