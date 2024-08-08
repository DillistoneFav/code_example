import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { usePrevious } from 'FMCore/hooks';
import { mergeDateTime } from 'FMCore/date';
import { BaseInput as BaseDateInput, Input as DateInput } from 'Controls/date';
import { Model, DateTime } from 'Types/entity';
import TimeZonePicker from 'TimeZones/Picker';
import { Button as TimeZoneButton } from 'TimeZones/timeZonePicker';
import { TIMEZONE_PICKER_CUSTOM_EVENTS } from './DateTimeWithTimeZone/constants';
import { inDateRange } from 'Controls/validate';
import { Feature } from 'FeatureAccess/feature';
import cn from 'FMCore/classnames';

import type {
    IBaseInputContext,
    IDateTimeWithTimeZoneProps,
    ISeparatedDateTime,
    TBaseInput
} from './DateTimeWithTimeZone/interfaces';

// Используем контекст для передачи пропсов в rightFieldTemplate и последующей валидации
// По другому не работает: любой обновление родителя вызывает перемонтирование темплейта
const BaseInputContext = createContext<IBaseInputContext>({
    baseInputRef: null,
    dateTime: {
        date: null,
        time: null
    },
    onValueChanged: () => undefined
});

function DateTimeWithTimeZone({
    dataQa,
    dateTime: initialDateTime,
    startValue,
    endValue,
    onDateTimeChange,
    dateTooltip,
    timeTooltip,
    timeZone,
    onTimeZoneChange,
    timeValidators = [],
    dateValidators = [],
    readOnly,
    timeAfterCalendar,
    datePlaceholder,
    timePlaceholder,
    className
}: IDateTimeWithTimeZoneProps): JSX.Element {
    const dateInputRef = useRef<DateInput>(null);
    const timeInputRef = useRef<TBaseInput>(null);

    const [dateTime, setDateTime] = useState<ISeparatedDateTime>({
        date: initialDateTime,
        time: initialDateTime
    });
    const previousDateTime = usePrevious(dateTime);

    const handleDateChange = (v: DateTime) => setDateTime(prev => ({
        date: v,
        time: prev.time ? mergeDateTime(v, prev.time) : prev.time
    }));

    const handleTimeChange = (v: DateTime) => setDateTime(prev => ({
        ...prev,
        time: prev.date ? mergeDateTime(prev.date, v) : v
    }));

    const validateDateFields = () => {
        dateInputRef.current?.validate();
        timeInputRef.current?.validate();
    };

    useEffect(() => {
        if (!previousDateTime) {
            return;
        }

        if (!dateTime.date || !dateTime.time) {
            onDateTimeChange(null);
            return;
        }

        const newDateTime = new DateTime(dateTime.date, true);
        newDateTime.setHours(dateTime.time.getHours());
        newDateTime.setMinutes(dateTime.time.getMinutes());

        onDateTimeChange(newDateTime);

        validateDateFields();
    }, [dateTime.date, dateTime.time]);

    useEffect(() => {
        if (!dateTime.date || !dateTime.time || !startValue || !endValue) {
            return;
        }

        validateDateFields();
    }, [startValue, endValue]);

    const handleTimeZoneChange = ({ timeZoneOffset, timeZoneName }) => onTimeZoneChange({
        offset: timeZoneOffset,
        name: timeZoneName
    });

    const handleTimeZoneItemSelected = useCallback((item: Model) => onTimeZoneChange({
        name: item.get('Name'),
        offset: item.get('Offset')
    }), [onTimeZoneChange]);

    const isDayAvailable = (date: Date) => {
        if (!startValue || !endValue) {
            return true;
        }

        return inDateRange({ value: date, minValue: startValue, maxValue: endValue }) === true;
    };

    const contextValue: IBaseInputContext = useMemo(() => ({
        baseInputRef: timeInputRef,
        dateTime,
        onValueChanged: handleTimeChange,
        valueValidators: timeValidators,
        readOnly,
        timeTooltip,
        timePlaceholder
    }), [dateTime, timeValidators, readOnly, timeTooltip, timePlaceholder]);

    const isNewTimeZonesFeatureOn = useMemo(() => Feature.get(['time-zones-new'])[0], []);

    return (
        <BaseInputContext.Provider value={contextValue}>
            <div data-qa={dataQa} className={cn(className, 'tw-flex tw-items-baseline')}>
                <DateInput
                    ref={dateInputRef}
                    readOnly={readOnly}
                    valueValidators={dateValidators}
                    disableValidators={!dateTime.time}
                    isDayAvailable={isDayAvailable}
                    mask="DD.MM.YY"
                    tooltip={dateTooltip}
                    value={dateTime.date}
                    onValueChanged={handleDateChange}
                    rightFieldTemplate={!timeAfterCalendar ? BaseInputWithContext : null}
                    placeholder={datePlaceholder}
                />

                {Boolean(timeAfterCalendar) && <BaseInputWithContext value={dateTime.date} />}

                {isNewTimeZonesFeatureOn ? (
                    <TimeZoneButton
                        className="controls-margin_left-s"
                        name={timeZone.name}
                        fontColorStyle="label"
                        readOnly={readOnly}
                        onItemSelected={handleTimeZoneItemSelected}
                    />
                ) : (
                    <TimeZonePicker
                        readOnly={readOnly}
                        className="controls-margin_left-s"
                        buttonFontColorStyle="label"
                        timeZoneName={timeZone.name}
                        timeZoneOffset={timeZone.offset}
                        customEvents={TIMEZONE_PICKER_CUSTOM_EVENTS}
                        onFinishSelecting={handleTimeZoneChange}
                    />
                )}
            </div>
        </BaseInputContext.Provider>
    );
}

function BaseInputWithContext() {
    const {
        baseInputRef,
        dateTime,
        valueValidators,
        onValueChanged,
        readOnly,
        timeTooltip,
        timePlaceholder
    } = useContext(BaseInputContext);

    return (
        <BaseDateInput
            ref={baseInputRef}
            value={dateTime.time}
            valueValidators={valueValidators}
            disableValidators={!dateTime.date}
            readOnly={readOnly}
            className="controls-margin_left-s"
            mask="HH:mm"
            tooltip={timeTooltip}
            onValueChanged={onValueChanged}
            placeholder={timePlaceholder}
        />
    );
}

export default DateTimeWithTimeZone;
