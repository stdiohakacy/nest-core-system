import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../../../common/pagination/constants/pagination.enum.constant';

export const CONVERSATION_DEFAULT_PER_PAGE = 20;
export const CONVERSATION_DEFAULT_ORDER_BY = 'createdAt';
export const CONVERSATION_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const CONVERSATION_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt'];
export const CONVERSATION_DEFAULT_AVAILABLE_SEARCH = ['name'];

export const CONVERSATION_DEFAULT_IS_ACTIVE = [true, false];
export const CONVERSATION_DEFAULT_BLOCKED = [true, false];
export const CONVERSATION_DEFAULT_INACTIVE_PERMANENT = [true, false];
