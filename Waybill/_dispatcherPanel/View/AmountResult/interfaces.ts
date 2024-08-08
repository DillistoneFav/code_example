import type { ReactNode } from 'react';
import type { TFontSize } from 'Controls/interface';

export interface IAmountResultProps {
    fuelCoefficient: number;
    value: number | null;
    planValue: number | null;
    planValuePrecision: number;
    factValue: number | null;
    planText?: string;
    label: ReactNode | string;
    difference: number | null;
    measure: string;
    className?: string;
    fontSize?: TFontSize;
}

export interface IDifferenceProps {
    value: IAmountResultProps['difference'];
    measure?: IAmountResultProps['measure'];
    fontSize?: TFontSize;
}
