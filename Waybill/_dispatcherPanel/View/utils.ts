import { TimeZonesService } from 'TimeZones/service';
import {
    DEFAULT_TIME_ZONE_VALUE,
    type IWaybillProperty,
    type TReadingLabel
} from 'WorksManagement/Wasaby/Transport/Waybill/detailModel';
import { showErrorNotification } from 'FMCore/error';
import * as rk from 'i18n!WorksManagement';

import type {
    IDispatcherInfo,
    ITimeZone,
    TExecutorItemChangeHandler
} from 'WorksManagement/Wasaby/Transport/Waybill/interfaces';
import type { TDispatcherInfoChangeHandler } from './interfaces';
import type { TNullable } from 'FMCore/interface';

interface IGetWaybillPropertyForConsumptionMethodsProps {
    waybillProperty: IWaybillProperty;
    fuelBefore: number;
    fuelAfter: number;
}

export const getWaybillPropertyForConsumptionMethods = ({
    waybillProperty,
    fuelBefore,
    fuelAfter
}: IGetWaybillPropertyForConsumptionMethodsProps): TNullable<IWaybillProperty> => {
    if (!waybillProperty) {
        return null;
    }

    const vehicle = waybillProperty.Vehicle;
    const trailer = waybillProperty.Trailer;

    const newProperty = {
        ...waybillProperty
    };

    if (vehicle) {
        newProperty.Vehicle = {
            ...vehicle,
            FuelTanks: [{
                FuelBalanceBefore: fuelBefore,
                FuelBalanceAfter: fuelAfter,
                FuelConsumptionType: vehicle?.FuelConsumptionType,
                FuelConsumptionValuePerKm: vehicle?.FuelConsumptionValuePerKm,
                FuelConsumptionValuePerHour: vehicle?.FuelConsumptionValuePerHour,
                POLId: vehicle?.POLId,
                POLName: vehicle?.POLName
            }]
        };
    }

    if (trailer) {
        newProperty.Trailer = {
            ...trailer,
            FuelTanks: [{
                FuelBalanceBefore: fuelBefore,
                FuelBalanceAfter: fuelAfter,
                FuelConsumptionType: trailer?.FuelConsumptionType,
                FuelConsumptionValuePerKm: trailer?.FuelConsumptionValuePerKm,
                FuelConsumptionValuePercent: trailer?.FuelConsumptionValuePercent
            }]
        };
    }

    return newProperty;
};

/**
 * получить обработчик смены часового пояса
 */
export const createTimeZoneChangeHandler = (
    dispatcherInfo: IDispatcherInfo,
    dispatcherInfoChangeHandler: TDispatcherInfoChangeHandler
) => (value: ITimeZone) => dispatcherInfoChangeHandler({
    ...dispatcherInfo,
    timeZone: value
});

/**
 * получить обработчик смены диспетчера
 */
export const createDispatcherChangeHandler = (
    dispatcherChangeHandler: TExecutorItemChangeHandler,
    timeZoneChangeHandler: ReturnType<typeof createTimeZoneChangeHandler>
): TExecutorItemChangeHandler => async (executor) => {
    dispatcherChangeHandler(executor);

    if (!executor || !executor.id) {
        timeZoneChangeHandler(DEFAULT_TIME_ZONE_VALUE);
        return;
    }

    try {
        const timeZone = await TimeZonesService.getTimeZoneByPrivatePersons({
            faces: [executor.id]
        });

        timeZoneChangeHandler({
            name: timeZone.get('timezone'),
            offset: timeZone.get('utc_offset')
        });
    } catch (e) {
        showErrorNotification('Не удалось получить часовой пояс сотрудника');
    }
};

interface IValidator {
    value: number | string;
    compareValue?: number | string;
    readingLabel?: TReadingLabel;
}

interface IConvertedNumbs {
    numbValue: number;
    compareNumbValue: number;
}

const RADIX = 10;

/**
 * Валидация полей одометра
 * @param {IValidator} options валидируемые значения
 * @returns {boolean|string}
 */
export function validateOdometer({ value, compareValue, readingLabel = 'Одометр' }: IValidator): true | string {
    if (!value || !compareValue) { return true; }

    const { numbValue, compareNumbValue } = getCorrectVals(value, compareValue);

    return compareNumbValue > numbValue
        ? `"${rk(readingLabel)} ${rk('После')}" ${rk('не может быть меньше')} "${rk(readingLabel)} ${rk('До')}"`
        : true;
}

/**
 * Получение корректных значний в виде инта
 * @param {string|number} val значение актуальное
 * @param {string|number} compareValue значение, которое было
 * @returns {IConvertedNumbs}
 */
function getCorrectVals(val: string | number, compareValue: string | number): IConvertedNumbs {
    return {
        numbValue: numberConverter(val),
        compareNumbValue: numberConverter(compareValue)
    };
}

/**
 * Конвертер из строки в число
 * @param {number|string} val конвертируемое значение
 * @returns {number}
 * @remark
 * типизация ругается если сразу сделать parseInt у типа string|number, из-за этого проверка
 */
function numberConverter(val: string | number): number {
    return typeof val === 'string' ? parseInt(val, RADIX) : val;
}
