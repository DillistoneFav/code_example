import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'Types/function';
import { WaybillService } from 'WorksManagement/Wasaby/Transport/Waybill/services/WaybillService';

import type { IUseFuelConsumptionParams, TUseFuelConsumption } from './useFuelConsumption/interfaces';
import type {
    IGetActualFuelConsumptionParams,
    IGetPlanFuelConsumptionParams
} from 'WorksManagement/Wasaby/Transport/Waybill/services/interfaces';
import type { TNullable } from 'FMCore/interfaces';

const DEBOUNCE_TIME = 200;

/**
 * Содержит логику, связанную с расчётом расхода топлива
 */
export const useFuelConsumption = ({
    fuelBefore,
    fuelAfter,
    waybillId,
    waybillProperty,
    fuelCoefficient,
    vehicleId,
    trailerId
}: IUseFuelConsumptionParams): TUseFuelConsumption => {
    const [actualFuelConsumption, setActualFuelConsumption] = useState<TNullable<number>>(null);
    const [planFuelConsumption, setPlanFuelConsumption] = useState<TNullable<number>>(null);

    const debouncedFetchActualFuelConsumption = useMemo(() => debounce(
        async (params: IGetActualFuelConsumptionParams) => {
            const fuelTanks = await WaybillService.getActualFuelConsumption(params);

            setActualFuelConsumption(fuelTanks?.[0]?.FactFuelConsumption || null);
        },
        DEBOUNCE_TIME
    ), []);

    useEffect(() => {
        debouncedFetchActualFuelConsumption({ waybillProperty, waybillId });
    }, [
        waybillId,
        fuelBefore,
        fuelAfter,
        vehicleId,
        trailerId,
        debouncedFetchActualFuelConsumption
    ]);

    const debouncedFetchPlanFuelConsumption = useMemo(() => debounce(
        async (params: IGetPlanFuelConsumptionParams) => {
            const fuelTanks = await WaybillService.getPlanFuelConsumption(params);

            setPlanFuelConsumption(fuelTanks?.[0]?.PlanFuelConsumption || null);
        },
        DEBOUNCE_TIME
    ), []);

    useEffect(() => {
        debouncedFetchPlanFuelConsumption({
            waybillProperty,
            fuelCoefficient,
            waybillId,
            vehicleId,
            trailerId
        });
    }, [
        waybillProperty?.EngineHoursBefore,
        waybillProperty?.EngineHoursAfter,
        waybillProperty?.OdometerBefore,
        waybillProperty?.OdometerAfter,
        fuelCoefficient,
        waybillId,
        vehicleId,
        trailerId,
        debouncedFetchPlanFuelConsumption
    ]);

    return {
        actual: actualFuelConsumption,
        plan: planFuelConsumption
    };
};
