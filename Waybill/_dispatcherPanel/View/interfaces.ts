import type {
    IExecutorItem,
    TExecutorItemChangeHandler,
    IDispatcherInfo
} from 'WorksManagement/Wasaby/Transport/Waybill/interfaces';
import type {
    IWaybillProperty,
    TReadingLabel,
    TReadingMeasure,
    TReadingResultLabel
} from 'WorksManagement/Wasaby/Transport/Waybill/detailModel';
import type { IUseFuelResultLabelParams } from './useFuelResultLabel';
import type { DateTime } from 'Types/entity';
import type { TNullable } from 'FMCore/interfaces';

type TAmount = number | null;

type TAmountChangeHandler = (amount: TAmount) => void;

interface IDateTimeInterval {
    start: TNullable<DateTime>;
    end: TNullable<DateTime>;
}

export type TDispatcherInfoChangeHandler = (value: IDispatcherInfo) => void;

export interface IVehicleReleaseProps extends IUseFuelResultLabelParams {
    waybillId: number;
    waybillInterval: IDateTimeInterval;
    fuelBefore: TAmount;
    onFuelBeforeChange: TAmountChangeHandler;
    fuelAfter: TAmount;
    onFuelAfterChange: TAmountChangeHandler;
    readingBefore: TAmount;
    onReadingBeforeChange: TAmountChangeHandler;
    readingAfter: TAmount;
    onReadingAfterChange: TAmountChangeHandler;
    readingResult: number;
    plannedReadingResult: number;
    readingMeasure: TReadingMeasure;
    readingLabel: TReadingLabel;
    readingResultLabel: TReadingResultLabel;
    fuelCoefficient: number;
    preTripDispatcher: IExecutorItem | null;
    onPreTripDispatcherChange: TExecutorItemChangeHandler;
    vehicleReleaseInfo: IDispatcherInfo;
    onVehicleReleaseInfoChange: TDispatcherInfoChangeHandler;
    postTripDispatcher: IExecutorItem | null;
    onPostTripDispatcherChange: TExecutorItemChangeHandler;
    postTripDispatcherInfo: IDispatcherInfo;
    onPostTripDispatcherInfoChange: TDispatcherInfoChangeHandler;
    waybillProperty: IWaybillProperty;
    className?: string;
    isContractorStage: boolean;
    isDocumentReadOnly: boolean;
    isPreTripDispatcherReadOnly: boolean;
    isPostTripDispatcherReadOnly: boolean;
    isArrivalVehicleCheckInfoReadOnly: boolean;
    vehicleId: number | null;
    trailerId: number | null;
    currentDateTime: Date;
}

export interface TDateValidationValue {
    value: TNullable<Date>;
}

export type TDispatcherDateValidator = (date: TDateValidationValue) => boolean | string;