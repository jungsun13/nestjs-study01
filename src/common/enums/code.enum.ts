export enum AppHttpCode {
  /** 공통 오류 */
  /** 서버 오류 */
  SERVICE_ERROR = 500500,
  /** 데이터가 비어 있음 */
  DATA_IS_EMPTY = 100001,
  /** 인자 오류 */
  PARAM_INVALID = 100002,
  /** 파일 형식 오류 */
  FILE_TYPE_ERROR = 100003,
  /** 파일 크기 초과 */
  FILE_SIZE_EXCEED_LIMIT = 100004,
  /** 이미 존재하는 사용자, 휴대폰 번호, 이메일, 사용자 이름 등 */
  USER_CREATE_EXISTING = 200001,
  /** 비밀번호 2회 입력 불일치, 아이디 비밀번호 불일치 등 */
  USER_PASSWORD_INVALID = 200002,
  /** 계정이 비활성화됨 */
  USER_ACCOUNT_FORBIDDEN = 200003,
  /** 사용자 상태 변경, 현재 사용자 및 수정된 사용자 일치*/
  USER_FORBIDDEN_UPDATE = 20004,
  /** 사용자가 존재하지 않습니다 */
  USER_NOT_FOUND = 200004,
  /** 캐릭터를 찾을 수 없음 */
  ROLE_NOT_FOUND = 300004,
  /** 캐릭터를 삭제할 수 없음 */
  ROLE_NOT_DEL = 300005,
  /** 권한 없음 */
  ROLE_NO_FORBIDDEN = 300403,
  /** 메뉴를 찾을 수 없음 */
  MENU_NOT_FOUND = 400004,
  /** 부서가 존재하지 않습니다 */
  DEPT_NOT_FOUND = 500004,
  /** 직급이 존재함 */
  POST_REPEAT = 600001,
  /** 직책이 존재하지 않습니다 */
  POST_NOT_FOUND = 600004,
}
