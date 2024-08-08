import { Button } from 'Controls/buttons';

import 'css!WorksManagement/Wasaby/Transport/Waybill/dialogControls';

export interface IRevertValueInfobox {
    close: Function;
    suggestedValue: number;
    onValueChange: (value: number) => void;
}

export function RevertValueInfobox({ close, suggestedValue, onValueChange }: IRevertValueInfobox): JSX.Element {
    return (
        <div className="ETT-VehicleRelease__infobox">
            <p className="controls-text-unaccented controls-margin_bottom-l">
                Остаток отредактирован вручную
            </p>

            <p>
                В баке {suggestedValue} л
                <Button
                    className="controls-margin_left-m"
                    viewMode="link"
                    caption="Вернуть"
                    onClick={() => {
                        onValueChange(suggestedValue);
                        close();
                    }}
                />
            </p>
        </div>
    );
}
