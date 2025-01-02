import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResultData } from '../utils/result';

const baseTypeNames = ['String', 'Number', 'Boolean'];

/**
 * 패키지 swagger가 통일된 구조로 돌아갑니다
 * 복잡한 형식 {code, msg, data } 지원
 * @param model에서 반환한 data의 데이터 형식
 * @param isArray data가 배열인지 여부
 * @paramisPager가 true로 설정되어 있으면 data 형식은 {list, total }, false data 형식은 순수 배열입니다
 */
export const ApiResult = <TModel extends Type<any>>(
  model?: TModel,
  isArray?: boolean,
  isPager?: boolean,
) => {
  let items = null;
  const modelIsBaseType = model && baseTypeNames.includes(model.name);
  if (modelIsBaseType) {
    items = { type: model.name.toLocaleLowerCase() };
  } else {
    items = { $ref: getSchemaPath(model) };
  }
  let prop = null;
  if (isArray && isPager) {
    prop = {
      type: 'object',
      properties: {
        list: {
          type: 'array',
          items,
        },
        total: {
          type: 'number',
          default: 0,
        },
      },
    };
  } else if (isArray) {
    prop = {
      type: 'array',
      items,
    };
  } else if (model) {
    prop = items;
  } else {
    prop = { type: 'null', default: null };
  }
  return applyDecorators(
    ApiExtraModels(
      ...(model && !modelIsBaseType ? [ResultData, model] : [ResultData]),
    ),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResultData) },
          {
            properties: {
              data: prop,
            },
          },
        ],
      },
    }),
  );
};
