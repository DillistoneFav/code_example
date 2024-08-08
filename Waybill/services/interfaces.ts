import type { Record, Date, Time, DateTime } from 'Types/entity';
import type { IWaybillFuelTank, IWaybillProperty, IVehicle, IDriver } from 'WorksManagement/Wasaby/Transport/Waybill/detailModel';

type TNullable<T = unknown> = T | null;

export interface IGetPlanFuelConsumptionParams {
    waybillId: number;
    waybillProperty: IWaybillProperty;
    fuelCoefficient: TNullable<number>;
    vehicleId: TNullable<number>;
    trailerId: TNullable<number>;
}

export interface IGetActualFuelConsumptionParams {
    waybillId: number;
    waybillProperty: IWaybillProperty;
}

export interface IExtendedFuelTank extends IWaybillFuelTank {
    PlanFuelConsumption: TNullable<number>;
    FactFuelConsumption: TNullable<number>;
}

export interface ICreateFilter {
    ВызовИзБраузера: boolean;
    ИдРегламента: string;
    'Waybill.StartDateTime': DateTime;
    'Waybill.EndDateTime': DateTime;
    Дата: Date;
    Время: Time;
}

interface IAdditionalParams {
    ИмяМетода: string;
}

export interface ICreateProps {
    filter: Partial<ICreateFilter>;
    additionalParams?: Partial<IAdditionalParams>;
}

export interface IUpdateWaybillData {
    Дата?: string | Date;
    'Waybill.Property'?: IWaybillProperty;
    'Waybill.PropertyDiff'?: IWaybillProperty;
    'РП.DriverRec': TNullable<Record<IDriver>>;
    'Waybill.Driver'?: TNullable<number>;
    'РП.CarRec': TNullable<Record<IVehicle>>;
    'Waybill.Vehicle'?: TNullable<number>;
    'РП.TrailerRec'?: TNullable<Record<IVehicle>>;
    'Waybill.Trailer'?: TNullable<number>;
    'Waybill.StartDate'?: TNullable<Date>;
    'Waybill.StartTime'?: TNullable<Time>;
    'Waybill.EndDate'?: TNullable<Date>;
    'Waybill.EndTime'?: TNullable<Time>;
    'СброситьЧерновик'?: boolean;
}

export type TUpdateField = Partial<keyof IUpdateWaybillData>;
