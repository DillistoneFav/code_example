import type { ITimeZone } from 'WorksManagement/Wasaby/Transport/Waybill/interfaces';
import type { TValidator } from 'Controls/validate';
import type { BaseInput, IDateBaseOptions } from 'Controls/date';
import type { TNullable } from 'FMCore/interfaces';
import type { DateTime } from 'Types/entity';
import type { RefObject } from 'react';

export interface TDateValidationValue {
    value: DateTime;
}

export interface IDateTimeWithTimeZoneProps {
    dataQa?: string;
    dateTooltip: string;
    timeTooltip: string;
    dateTime: TNullable<Date>;
    startValue?: Date;
    endValue?: Date;
    onDateTimeChange: (value: TNullable<Date>) => void;
    timeZone: ITimeZone;
    onTimeZoneChange: (value: ITimeZone) => void;
    timeValidators?: TValidator<TDateValidationValue>[];
    dateValidators?: TValidator<TDateValidationValue>[];
    readOnly?: boolean;
    timeAfterCalendar?: boolean;
    datePlaceholder?: string;
    timePlaceholder?: string;
    className?: string;
}

export interface ISeparatedDateTime {
    date: TNullable<Date>;
    time: TNullable<Date>;
}

export type TBaseInput = BaseInput<IDateBaseOptions>;

export interface IBaseInputContext {
    baseInputRef: RefObject<TBaseInput> | null;
    dateTime: ISeparatedDateTime;
    onValueChanged: (event: Event, value: TNullable<Date>) => void;
    valueValidators?: TValidator<TDateValidationValue>[];
    timeTooltip?: string;
    readOnly?: boolean;
    timePlaceholder?: string;
}
