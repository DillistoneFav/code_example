import cn from 'FMCore/classnames';
import { rounder } from 'FMCore/math';
import { Button } from 'Controls/buttons';
import * as rk from 'i18n!WorksManagement';
import {
    useLastKnownVehicleInfoContext,
    useDispatcherPanelContext
} from 'WorksManagement/Wasaby/Transport/Waybill/dialogContexts';
import { DateTimeUnit } from 'FMCore/date';
import {
    ExecutorInput,
    Title,
    DateTimeWithTimeZone,
    AmountInputField,
    ONLY_EMPLOYEE_ENTITIES_CONFIG
} from 'WorksManagement/Wasaby/Transport/Waybill/dialogControls';
import AmountResult from './View/AmountResult';
import {
    FUEL_AMOUNT_INTEGERS_LENGTH,
    FUEL_AMOUNT_PRECISION,
    READING_INTEGERS_LENGTH,
    READING_PRECISION,
    DISPATCHER_HISTORY_ID
} from './View/constants';
import {
    createDispatcherChangeHandler,
    createTimeZoneChangeHandler,
    getWaybillPropertyForConsumptionMethods,
    validateOdometer
} from './View/utils';
import { isFuelInputReadOnly } from 'WorksManagement/Wasaby/Transport/Waybill/dialog/utils';
import { useFuelConsumption } from './View/useFuelConsumption';
import { useFuelResultLabel } from './View/useFuelResultLabel';
import { RevertValueInfobox } from './View/RevertValueInfobox';
import { UpdateVehicleInfoButton } from './View/UpdateVehicleInfoButton';
import { validateDepartureArrivalOrder } from './View/validation';
import {
    getDateTimePlaceholder,
    hasMedicDatesFeature,
    isIntervalIncludesDateOrTime,
    prepareIntervalDate
} from '../utils';

import type { TValidator } from 'Controls/validate';
import type { IVehicleReleaseProps, TDateValidationValue } from './View/interfaces';

import 'css!WorksManagement/Wasaby/Transport/Waybill/dispatcherPanel';

function DispatcherPanel({
    fuelBefore,
    waybillInterval,
    onFuelBeforeChange,
    fuelAfter,
    onFuelAfterChange,
    fuelCoefficient,
    readingBefore,
    onReadingBeforeChange,
    readingAfter,
    onReadingAfterChange,
    readingResult,
    plannedReadingResult,
    readingMeasure,
    readingLabel,
    readingResultLabel,
    waybillId,
    vehicleId,
    trailerId,
    preTripDispatcher,
    onPreTripDispatcherChange,
    vehicleReleaseInfo,
    onVehicleReleaseInfoChange,
    postTripDispatcher,
    onPostTripDispatcherChange,
    postTripDispatcherInfo,
    onPostTripDispatcherInfoChange,
    waybillProperty,
    className,
    isContractorStage,
    isDocumentReadOnly,
    isPreTripDispatcherReadOnly,
    isPostTripDispatcherReadOnly,
    currentDateTime,
    ...useFuelResultLabelParams
}: IVehicleReleaseProps) {
    const fuelConsumption = useFuelConsumption({
        fuelBefore,
        fuelAfter,
        waybillId,
        waybillProperty: getWaybillPropertyForConsumptionMethods({ waybillProperty, fuelBefore, fuelAfter }),
        fuelCoefficient,
        vehicleId,
        trailerId
    });

    const {
        fuelCoefficientButton,
        isVehicleReleaseInfoReadOnly,
        isArrivalVehicleCheckInfoReadOnly,
        isVehicleReleaseOdometerReadOnly,
        isVehicleArrivalOdometerReadOnly
    } = useDispatcherPanelContext();

    const { lastKnownVehicleInfo, overwriteLastKnownVehicleInfo } = useLastKnownVehicleInfoContext();

    const waybillDatesInterval = {
        start: prepareIntervalDate(waybillInterval.start),
        end: prepareIntervalDate(waybillInterval.end)
    };

    const departureDateTime = vehicleReleaseInfo.dateTime;
    const arrivalDateTime = postTripDispatcherInfo.dateTime;

    const actualAndPlanReadingsDifference = plannedReadingResult
        ? rounder(readingResult - plannedReadingResult, READING_PRECISION)
        : null;

    const actualAndPlanFuelDifference = rounder(
        (fuelConsumption.actual || 0) - fuelConsumption.plan,
        FUEL_AMOUNT_PRECISION
    );

    const shouldShowFuelDifference = readingResult && fuelConsumption.plan;

    const isReadingsValid = () => validateOdometer({
        value: readingAfter,
        compareValue: readingBefore,
        readingLabel: readingLabel.TITLE
    });

    const actualRemainingFuel = lastKnownVehicleInfo?.oldRemainingTankFuel;
    const hasRemainingFuel = typeof actualRemainingFuel === 'number';
    const fuelBeforeTagStyle = hasRemainingFuel && actualRemainingFuel !== fuelBefore
        ? 'warning'
        : undefined;

    const actualRemainingFuelInfobox = ({ close }) => {
        return (
            <RevertValueInfobox
                close={close}
                suggestedValue={actualRemainingFuel}
                onValueChange={onFuelBeforeChange}
            />
        );
    };

    const fuelResultLabel = useFuelResultLabel(useFuelResultLabelParams);

    const onPreTripTimeZoneChange = createTimeZoneChangeHandler(
        vehicleReleaseInfo,
        onVehicleReleaseInfoChange
    );

    const onPostTripTimeZoneChange = createTimeZoneChangeHandler(
        postTripDispatcherInfo,
        onPostTripDispatcherInfoChange
    );

    const isWaybillIncludesDateTime = (type: DateTimeUnit) => {
        return (date: TDateValidationValue) => isIntervalIncludesDateOrTime({
            date: date.value,
            startDate: waybillInterval.start,
            endDate: waybillInterval.end,
            type
        });
    };

    const departureDateValidators: TValidator<TDateValidationValue>[] = [
        isWaybillIncludesDateTime(DateTimeUnit.Date),
        validateDepartureArrivalOrder(null, arrivalDateTime, DateTimeUnit.Date)
    ];

    const departureTimeValidators: TValidator<TDateValidationValue>[] = [
        isWaybillIncludesDateTime(DateTimeUnit.Time),
        validateDepartureArrivalOrder(null, arrivalDateTime, DateTimeUnit.Time)
    ];

    const arrivalDateValidators: TValidator<TDateValidationValue>[] = [
        validateDepartureArrivalOrder(departureDateTime, null, DateTimeUnit.Date)
    ];

    const arrivalTimeValidators: TValidator<TDateValidationValue>[] = [
        validateDepartureArrivalOrder(departureDateTime, null, DateTimeUnit.Time)
    ];

    const updateVehicleInfoHandler = () => {
        if (!overwriteLastKnownVehicleInfo || !vehicleId) {
            return;
        }

        overwriteLastKnownVehicleInfo(vehicleId);
    };

    const hasDatesFeature = hasMedicDatesFeature();

    const preTimeZone = !departureDateTime ? vehicleReleaseInfo.timeZone.offset : null;
    const preDateTimePlaceholder = hasDatesFeature
        ? getDateTimePlaceholder(departureDateTime ?? currentDateTime, preTimeZone)
        : null;

    const postTimeZone = !arrivalDateTime ? postTripDispatcherInfo.timeZone.offset : null;
    const postDateTimePlaceholder = hasDatesFeature
        ? getDateTimePlaceholder(arrivalDateTime ?? currentDateTime, postTimeZone)
        : null;

    return (
        <div className={cn(className, 'controls-background-default controls_border-radius-s controls-margin_top-2xs controls-margin_bottom-2xs tw-grid tw-grid-cols-2')}>
            <div>
                <div>
                    <Title className="controls-margin_bottom-m" caption={rk('Выезд из гаража')} />
                    {!isVehicleReleaseInfoReadOnly && (
                        <UpdateVehicleInfoButton onUpdateInfoClick={updateVehicleInfoHandler} />
                    )}
                </div>

                {hasDatesFeature &&
                    <DateTimeWithTimeZone
                        dataQa="DispatcherPanelDepartureDateTime"
                        className="controls-margin_bottom-s"
                        readOnly={isVehicleReleaseInfoReadOnly}
                        dateTime={departureDateTime}
                        onDateTimeChange={(dateTime) => onVehicleReleaseInfoChange({
                            ...vehicleReleaseInfo,
                            dateTime
                        })}
                        startValue={waybillDatesInterval.start}
                        endValue={waybillDatesInterval.end}
                        dateValidators={departureDateValidators}
                        timeValidators={departureTimeValidators}
                        dateTooltip={preDateTimePlaceholder?.date || rk('Дата выезда')}
                        timeTooltip={preDateTimePlaceholder?.time || rk('Время выезда')}
                        timeZone={vehicleReleaseInfo.timeZone}
                        onTimeZoneChange={onPreTripTimeZoneChange}
                        timeAfterCalendar={hasDatesFeature}
                        datePlaceholder={preDateTimePlaceholder?.date}
                        timePlaceholder={preDateTimePlaceholder?.time}
                    />
                }

                <ExecutorInput
                    dataQa="DispatcherPanelDepartureExecutorInput"
                    historyId={DISPATCHER_HISTORY_ID}
                    readOnly={isPreTripDispatcherReadOnly}
                    className="controls-margin_bottom-s"
                    item={preTripDispatcher}
                    onItemChange={createDispatcherChangeHandler(
                        onPreTripDispatcherChange,
                        onPreTripTimeZoneChange
                    )}
                    {...ONLY_EMPLOYEE_ENTITIES_CONFIG}
                />

                <div>
                    <AmountInputField
                        dataQa="DispatcherPanelDepartureFuel"
                        readOnly={isFuelInputReadOnly(
                            isVehicleReleaseInfoReadOnly,
                            isDocumentReadOnly,
                            isContractorStage
                        )}
                        className="controls-margin_bottom-s ETT-VehicleRelease__inputField"
                        inputClassName="ETT-VehicleRelease__input"
                        label={rk('Топливо')}
                        value={fuelBefore}
                        onValueChanged={onFuelBeforeChange}
                        integersLength={FUEL_AMOUNT_INTEGERS_LENGTH}
                        precision={FUEL_AMOUNT_PRECISION}
                        tagStyle={fuelBeforeTagStyle}
                        infobox={actualRemainingFuelInfobox}
                    />

                    <AmountInputField
                        dataQa="DispatcherPanelDepartureOdometer"
                        readOnly={isVehicleReleaseOdometerReadOnly}
                        className="controls-margin_bottom-s ETT-VehicleRelease__inputField"
                        inputClassName="ETT-VehicleRelease__input"
                        label={readingLabel.TITLE}
                        value={readingBefore}
                        onValueChanged={onReadingBeforeChange}
                        integersLength={READING_INTEGERS_LENGTH}
                        precision={READING_PRECISION}
                        validators={[isReadingsValid]}
                    />
                </div>

                {!hasDatesFeature &&
                    <DateTimeWithTimeZone
                        dataQa="DispatcherPanelDepartureDateTime"
                        readOnly={isVehicleReleaseInfoReadOnly}
                        dateTime={departureDateTime}
                        onDateTimeChange={(dateTime) => onVehicleReleaseInfoChange({
                            ...vehicleReleaseInfo,
                            dateTime
                        })}
                        startValue={waybillDatesInterval.start}
                        endValue={waybillDatesInterval.end}
                        dateValidators={departureDateValidators}
                        timeValidators={departureTimeValidators}
                        dateTooltip={rk('Дата выезда')}
                        timeTooltip={rk('Время выезда')}
                        timeZone={vehicleReleaseInfo.timeZone}
                        onTimeZoneChange={onPreTripTimeZoneChange}
                    />
                }
            </div>

            <div>
                <div className="tw-flex tw-items-baseline controls-margin_bottom-m">
                    <p className="tw-flex-grow controls-text-label">{rk('Заезд')}</p>
                    {fuelCoefficientButton}
                </div>

                {hasDatesFeature &&
                    <DateTimeWithTimeZone
                        dataQa="DispatcherPanelArrivalDateTime"
                        className="controls-margin_bottom-s"
                        readOnly={isArrivalVehicleCheckInfoReadOnly}
                        dateTime={arrivalDateTime}
                        onDateTimeChange={(dateTime) => onPostTripDispatcherInfoChange({
                            ...postTripDispatcherInfo,
                            dateTime
                        })}
                        dateValidators={arrivalDateValidators}
                        timeValidators={arrivalTimeValidators}
                        dateTooltip={postDateTimePlaceholder?.date || rk('Дата заезда')}
                        timeTooltip={postDateTimePlaceholder?.time || rk('Время заезда')}
                        timeZone={postTripDispatcherInfo.timeZone}
                        onTimeZoneChange={onPostTripTimeZoneChange}
                        timeAfterCalendar={hasDatesFeature}
                        datePlaceholder={postDateTimePlaceholder?.date}
                        timePlaceholder={postDateTimePlaceholder?.time}
                    />
                }

                <ExecutorInput
                    dataQa="DispatcherPanelArrivalExecutorInput"
                    historyId={DISPATCHER_HISTORY_ID}
                    readOnly={isPostTripDispatcherReadOnly}
                    className="controls-margin_bottom-s"
                    item={postTripDispatcher}
                    onItemChange={createDispatcherChangeHandler(
                        onPostTripDispatcherChange,
                        onPostTripTimeZoneChange
                    )}
                    {...ONLY_EMPLOYEE_ENTITIES_CONFIG}
                    rightFieldTemplate={preTripDispatcher && !postTripDispatcher && (
                        <Button
                            viewMode="link"
                            caption={rk('тот же')}
                            fontColorStyle="label"
                            onClick={() => {
                                onPostTripDispatcherChange(preTripDispatcher);
                                onPostTripTimeZoneChange(vehicleReleaseInfo.timeZone);
                            }}
                        />
                    )}
                />

                <>
                    <AmountInputField
                        dataQa="DispatcherPanelArrivalFuel"
                        readOnly={isFuelInputReadOnly(
                            isArrivalVehicleCheckInfoReadOnly,
                            isDocumentReadOnly,
                            isContractorStage
                        )}
                        className="controls-margin_bottom-s"
                        inputClassName="ETT-VehicleRelease__input"
                        value={fuelAfter}
                        onValueChanged={onFuelAfterChange}
                        integersLength={FUEL_AMOUNT_INTEGERS_LENGTH}
                        precision={FUEL_AMOUNT_PRECISION}
                    >
                        <AmountResult
                            className="ETT-VehicleRelease__amountResult"
                            value={fuelConsumption.actual >= 0 ? fuelConsumption.actual : null}
                            label={fuelResultLabel}
                            difference={shouldShowFuelDifference ? actualAndPlanFuelDifference : null}
                            planValue={fuelConsumption.plan}
                            planValuePrecision={FUEL_AMOUNT_PRECISION}
                            planText={rk('По норме', 'контекст')}
                            measure={rk('л')}
                        />
                    </AmountInputField>

                    <AmountInputField
                        dataQa="DispatcherPanelArrivalOdometer"
                        readOnly={isVehicleArrivalOdometerReadOnly}
                        className="controls-margin_bottom-s"
                        inputClassName="ETT-VehicleRelease__input"
                        value={readingAfter}
                        onValueChanged={onReadingAfterChange}
                        integersLength={READING_INTEGERS_LENGTH}
                        precision={READING_PRECISION}
                        validators={[isReadingsValid]}
                    >
                        <AmountResult
                            className="ETT-VehicleRelease__amountResult"
                            value={readingResult}
                            label={readingResultLabel}
                            difference={actualAndPlanReadingsDifference}
                            measure={readingMeasure}
                            planValue={plannedReadingResult}
                            planValuePrecision={READING_PRECISION}
                        />
                    </AmountInputField>
                </>

                {!hasDatesFeature &&
                    <DateTimeWithTimeZone
                        dataQa="DispatcherPanelArrivalDateTime"
                        readOnly={isArrivalVehicleCheckInfoReadOnly}
                        dateTime={arrivalDateTime}
                        onDateTimeChange={(dateTime) => onPostTripDispatcherInfoChange({
                            ...postTripDispatcherInfo,
                            dateTime
                        })}
                        dateValidators={arrivalDateValidators}
                        timeValidators={arrivalTimeValidators}
                        dateTooltip={rk('Дата заезда')}
                        timeTooltip={rk('Время заезда')}
                        timeZone={postTripDispatcherInfo.timeZone}
                        onTimeZoneChange={onPostTripTimeZoneChange}
                    />
                }
            </div>
        </div>
    );
}

export default DispatcherPanel;
