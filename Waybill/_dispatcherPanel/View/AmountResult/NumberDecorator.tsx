import { Number as BaseNumberDecorator } from 'Controls/baseDecorator';

import type { TFontSize } from 'Controls/interface';

export interface INumberDecoratorProps {
    value: number;
    fontSize?: TFontSize;
}

const ABBREVIATE_VALUE_FROM = 1000;

function NumberDecorator({ value, fontSize }: INumberDecoratorProps): JSX.Element {
    const shouldAbbreviate = Math.abs(value) >= ABBREVIATE_VALUE_FROM;

    return (
        <BaseNumberDecorator
            fontSize={fontSize}
            value={value}
            abbreviationType={shouldAbbreviate ? 'short' : 'none'}
        />
    );
}

export default NumberDecorator;
