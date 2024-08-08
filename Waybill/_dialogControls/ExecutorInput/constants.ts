import { consts } from 'Addressee/common';
import * as rk from 'i18n!WorksManagement';
import LookupPlaceholder from './LookupPlaceholder';

export const MAX_VISIBLE_ITEMS = 5;
export const MIN_SEARCH_LENGTH = 3;

export const ENTITIES = [
    consts.TAB_KEY.EMPLOYEE,
    consts.TAB_KEY.COMPANY,
    consts.TAB_KEY.CLIENT
];
export const ONLY_EMPLOYEE_ENTITIES = [consts.TAB_KEY.EMPLOYEE];

export const ADDRESSEE_INPUT_CUSTOM_EVENTS = ['onSelectedItemsChanged'];

export const ONLY_EMPLOYEE_ENTITIES_CONFIG = {
    entities: ONLY_EMPLOYEE_ENTITIES,
    preplaceholder: rk('Укажите'),
    label: rk('сотрудника')
};

export const EMPLOYEE_AND_CONTRACTOR_ENTITIES_CONFIG = {
    entities: ENTITIES,
    customPlaceholder: LookupPlaceholder
};
