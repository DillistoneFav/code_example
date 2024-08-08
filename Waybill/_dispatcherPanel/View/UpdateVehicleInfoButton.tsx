import { Button } from 'Controls/buttons';
import * as rk from 'i18n!WorksManagement';

export interface IUpdateVehicleInfoButtonProps {
    readOnly?: boolean;
    onUpdateInfoClick?: () => void;
}

export function UpdateVehicleInfoButton({ readOnly, onUpdateInfoClick }: IUpdateVehicleInfoButtonProps) {
    return (
        <Button
            className="controls-margin_left-s"
            icon="icon-TFForward"
            iconSize="s"
            iconStyle="secondary"
            viewMode="ghost"
            inlineHeight="m"
            readOnly={readOnly}
            tooltip={rk('Перенести показания машины на начало путевого листа')}
            onClick={onUpdateInfoClick}
        />
    );
}
