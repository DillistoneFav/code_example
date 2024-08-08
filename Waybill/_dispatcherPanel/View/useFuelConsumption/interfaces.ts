import type {
    IGetPlanFuelConsumptionParams,
    IGetActualFuelConsumptionParams
} from 'WorksManagement/Wasaby/Transport/Waybill/services/interfaces';

export interface IUseFuelConsumptionParams extends IGetActualFuelConsumptionParams, IGetPlanFuelConsumptionParams {
    fuelBefore: number;
    fuelAfter: number;
}

export type TUseFuelConsumption = {
    actual: number | null;
    plan: number | null;
};
