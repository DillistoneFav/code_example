import cn from 'FMCore/classnames';
import { type ForwardedRef, forwardRef } from 'react';
import NumberDecorator from './AmountResult/NumberDecorator';
import { Number as BaseNumberDecorator } from 'Controls/baseDecorator';
import { InfoboxTarget } from 'Controls/popupTargets';
import { Difference } from './AmountResult/Difference';

import type { IAmountResultProps } from './AmountResult/interfaces';

import 'css!WorksManagement/Wasaby/Transport/Waybill/dialogControls';

function AmountResult({
    value,
    planValue,
    planText = 'По плану',
    planValuePrecision,
    difference,
    measure,
    label,
    className
}: IAmountResultProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element {
    if (!value) {
        return null;
    }

   const infoBoxTemplate = (
      <span>
         {planText}{' '}
         <BaseNumberDecorator value={planValue} precision={planValuePrecision} />{' '}
         {measure}
      </span>
   );

    return (
       <div
          ref={ref}
          className={cn(className, 'ETTControl-AmountResult', {
             'ETTControl-AmountResult--no-difference': !difference
          })}
       >
            <span>
                <span className="controls-text-label controls-fontsize-xs">{label}</span>
                {' '}
                <NumberDecorator value={value} />
            </span>

            <InfoboxTarget
                floatCloseButton={true}
                targetSide="bottom"
                alignment="end"
                trigger="hover|touch"
                template={infoBoxTemplate}
            >
                <Difference
                    value={difference}
                    measure={measure}
                />
            </InfoboxTarget>
        </div>
    );
}

export default forwardRef(AmountResult);
