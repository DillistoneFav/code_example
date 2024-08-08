import { consts } from 'Addressee/common';

import type { IExecutorItem } from 'WorksManagement/Wasaby/Transport/Waybill/interfaces';
import type { AddresseeModel } from 'Addressee/models';
import type { TContractorType } from 'WorksManagement/Wasaby/Transport/Waybill/detailModel';

/**
 * преобразовать запись адреси в сущность исполнителя
 */
export const addresseeModelToExecutorItem = (executor: AddresseeModel): IExecutorItem => {
    const employee = executor.get('OriginalRecord')?.get('Employee')
        ?? executor.get('Employee');

    return {
        id: executor.get('id') as number,
        photoId: employee?.Photo ?? null,
        name: executor.get('name') as string,
        type: getType(executor)
    };
};

enum ExtraEmployeeType {
    Candidate = 21,
    Employee = 22
}

const EXTRA_EMPLOYEE_TYPES = [ExtraEmployeeType.Candidate, ExtraEmployeeType.Employee] as const;

type TAddresseeModelType = TContractorType | ExtraEmployeeType;

/**
 * получить тип контрагента
 */
const getType = (executor: AddresseeModel): TContractorType => {
    if (executor.get('KeyType') === consts.TAB_KEY.EMPLOYEE) {
        return consts.CLIENT_TYPE.INDIVIDUAL;
    }

    if (executor.get('KeyType') === consts.TAB_KEY.COMPANY) {
        return consts.CLIENT_TYPE.COMPANIES;
    }

    const type = executor.get('Type') as TAddresseeModelType;

    if (!type) {
        return null;
    }

    if (EXTRA_EMPLOYEE_TYPES.includes(type)) {
        return consts.CLIENT_TYPE.INDIVIDUAL;
    }

    return type;
};
