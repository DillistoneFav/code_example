import { SbisService } from 'Types/source';
import { createRecordWithAdapter } from 'FMCore/record';
import { DetailModel as WaybillDetailModel } from 'WorksManagement/Wasaby/Transport/Waybill/detailModel';

import type {
    IGetActualFuelConsumptionParams,
    IGetPlanFuelConsumptionParams,
    IExtendedFuelTank,
    ICreateFilter,
    IUpdateWaybillData
} from './interfaces';
import type { Model } from 'Types/entity';

export class WaybillService {
    static readonly source: SbisService = new SbisService({
        endpoint: 'Waybill',
        binding: {
            read: 'ПрочитатьДляУчастника',
            update: 'Записать',
            destroy: 'Документ.УдалитьДокументы',
            format: 'Waybill.Список'
        },
        options: {
            passAddFieldsFromMeta: true
        },
        model: WaybillDetailModel
    });

    static importRoute = async (waybillId: number, routeId: number): Promise<unknown> => {
        const { createRecordWithAdapter } = await import('FMCore/record');

        return WaybillService.source.call('ImportRouteDWC', {
            Params: createRecordWithAdapter({
                Waybill: waybillId,
                Route: routeId
            })
        });
    };

    static getById = async (id: number): Promise<Model> => {
        return WaybillService.source.read(id, {
            ИмяОбъекта: 'Waybill'
        });
    };

    static getPlanFuelConsumption = async ({
        waybillId,
        waybillProperty,
        fuelCoefficient,
        vehicleId,
        trailerId
    }: IGetPlanFuelConsumptionParams): Promise<IExtendedFuelTank[]> => {
        const answer = await WaybillService.source.call('GetPlanFuelConsumption', {
            Документ: createRecordWithAdapter({
                '@Документ': waybillId,
                'Waybill.Property': waybillProperty,
                'Waybill.TotalFuelCoefficient': fuelCoefficient,
                'Waybill.Vehicle': vehicleId,
                'Waybill.Trailer': trailerId
            })
        });

        return answer.getScalar();
    };

    static getActualFuelConsumption = async ({
        waybillId,
        waybillProperty
    }: IGetActualFuelConsumptionParams): Promise<IExtendedFuelTank[]> => {
        const answer = await WaybillService.source.call('GetFactFuelConsumption', {
            Документ: createRecordWithAdapter({
                '@Документ': waybillId,
                'Waybill.Property': waybillProperty
            })
        });

        return answer.getScalar();
    };

    static update = async (id: number, data: Partial<IUpdateWaybillData>): Promise<void> => {
        await WaybillService.source.update(createRecordWithAdapter({
            '@Документ': id,
            ...data
        }));
    };

    static create = async (filter: Partial<ICreateFilter>): Promise<WaybillDetailModel> => {
        const res = await WaybillService.source.create(filter);

        return res;
    };

    static unlinkDTask = async (waybillKey: number, tasks: number[]): Promise<void> => {
        await WaybillService.source.call('DeleteDTLink', {
            DeliveryTasks: tasks,
            Waybill: waybillKey
        });
    };

    static destroy = async (key: number) => {
        await WaybillService.source.destroy(key);
    };
}
