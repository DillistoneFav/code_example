import { useState, useEffect, useRef, ReactNode } from 'react';
import * as rk from 'i18n!WorksManagement';
import { Button } from 'Controls/buttons';
import { SbisService } from 'Types/source';

import type { TNullable } from 'FMCore/interfaces';

export interface IUseFuelResultLabelParams {
    isDocDone: boolean;
    fuelId: TNullable<number>;
    balancesDialogFilter: object;
}

export const useFuelResultLabel = ({
    fuelId,
    balancesDialogFilter,
    isDocDone
}: IUseFuelResultLabelParams): ReactNode => {
    const [costingMethod, setCostingMethod] = useState<TCostingMethod | null>(null);

    useEffect(() => {
        const fetchCostingMethod = async () => {
            const method = await getCostingMethod();
            setCostingMethod(method);
        };

        fetchCostingMethod();
    }, []);

    const balancesDialogOpenerRef = useRef(null);
    const openerRef = useRef(null);

    const openBalancesDialog = async () => {
        if (!balancesDialogOpenerRef.current) {
            const LightOpener = await import('Warehouse_Stats/VDWarehouseReports/BalancesDialog/API/LightOpener');
            balancesDialogOpenerRef.current = new LightOpener.default();
        }

        balancesDialogOpenerRef.current?.openBalanceDialog(
            openerRef.current,
            balancesDialogFilter,
            {
                selectionMode: true,
                readMode: true
            }
        );
    };

    if (costingMethod === 'fifo' && fuelId && isDocDone) {
        return (
            <Button
                ref={openerRef}
                readOnly={false}
                tooltip={LABEL}
                caption={LABEL}
                fontColorStyle="label"
                fontSize="xs"
                translucent="none"
                viewMode="link"
                onClick={openBalancesDialog}
            />
        );
    }

    return LABEL;
};

const LABEL = rk('Расход', 'WorksManagement');

const GLOBAL_CLIENT_PARAMS_SOURCE = new SbisService({
    endpoint: 'ГлобальныеПараметрыКлиента'
});

type TCostingMethod = 'fifo' | string;

/**
 * Получение данных о типе расчета
 * @private
 * @returns {Promise<TCostingMethod>}
 */
const getCostingMethod = async (): Promise<TCostingMethod> => {
    const data = await GLOBAL_CLIENT_PARAMS_SOURCE.call('ПолучитьЗначение', {
        Путь: 'РасчетСебестоимости.Метод'
    });

    return data.getScalar();
};
