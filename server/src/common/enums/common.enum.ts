export enum UserType {
  /** 하이퍼튜브 */
  SUPER_ADMIN = 0,
  /** 일반 사용자 */
  ORDINARY_USER = 1,
}

export enum StatusValue {
  /** 사용하지 않음 */
  FORBIDDEN = 0,
  /** 정상적으로 사용 */
  NORMAL = 1
}

export enum MenuType {
  /** 메뉴 */
  MENU = 1,
  /** 탭s 페이지 메뉴 */
  TAB = 2,
  /** 버튼 */
  BUTTON = 3,
}