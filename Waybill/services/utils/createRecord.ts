import { Record as EntityRecord } from 'Types/entity';

type TCreateRecord = <T extends Record<string, unknown> = Record<string, unknown>>(filter: T) => EntityRecord<T>;

/**
 * создать запись
 */
export const createRecord: TCreateRecord = (filter) => {
    return EntityRecord.fromObject(filter, 'adapter.sbis');
};
