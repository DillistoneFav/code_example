import { forwardRef } from 'react';
import NumberDecorator from './NumberDecorator';
import cn from 'FMCore/classnames';

import type { IDifferenceProps } from './interfaces';

export const Difference = forwardRef<HTMLSpanElement, IDifferenceProps>(({
    value,
    measure,
    fontSize,
    ...props
}, ref): JSX.Element => {
    if (!value) {
        return <span ref={ref} />;
    }

    return (
        <span
            {...props}
            ref={ref}
            className={cn({
                'controls-text-danger': value > 0,
                'controls-text-success': value <= 0
            })}
        >
            {value > 0 && '+ '}
            <NumberDecorator value={value} fontSize={fontSize} />
            {' '}
            <span className="controls-text-label controls-fontsize-xs">{measure}</span>
        </span>
    );
});
