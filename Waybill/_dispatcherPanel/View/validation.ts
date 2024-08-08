import { getDateTimeValue, isValidDatesOrder, type DateTimeUnit } from 'FMCore/date';
import { prepareDateTimeToCompare } from '../../utils';

import type { TNullable } from 'FMCore/interfaces';
import type { TDateValidationValue, TDispatcherDateValidator } from './interfaces';

/**
 * Валидатор даты Заезда и Выезда.
 * @param {TNullable<Date>} departure дата выезда
 * @param {TNullable<Date>} arrival дата заезда
 * @param {DateTimeUnit} type тип сравнения
 * @private
 * @returns {boolean | string} результат валидации.
 */
const validateDepartureAndArrivalDate = (
    departure: TNullable<Date>,
    arrival: TNullable<Date>,
    type: DateTimeUnit
) => {
    const newDepartureDateTime = getDateTimeValue(departure);
    const newArrivalDateTime = getDateTimeValue(arrival);

    if (!newDepartureDateTime || !newArrivalDateTime) {
        return true;
    }

    const depDateTime = prepareDateTimeToCompare(newDepartureDateTime, type);
    const arrDateTime = prepareDateTimeToCompare(newArrivalDateTime, type);

    const isValidOrder = isValidDatesOrder(depDateTime, arrDateTime);

    return isValidOrder ? true : 'Время заезда должно быть позднее времени выезда';
};

/**
 * Получить валидатор даты Заезда и Выезда.
 * @param {TNullable<Date>} departureValue дата выезда
 * @param {TNullable<Date>} arrivalValue дата заезда
 * @param {DateTimeUnit} type тип сравнения
 * @private
 * @returns {TDispatcherDateValidator} валидатор дат.
 */
export const validateDepartureArrivalOrder = (
    departureValue: TNullable<Date>,
    arrivalValue: TNullable<Date>,
    type: DateTimeUnit
): TDispatcherDateValidator => {
    return (date: TDateValidationValue) => {
        const startValue = departureValue ?? date.value;
        const endValue = arrivalValue ?? date.value;

        return validateDepartureAndArrivalDate(startValue, endValue, type);
    };
};
