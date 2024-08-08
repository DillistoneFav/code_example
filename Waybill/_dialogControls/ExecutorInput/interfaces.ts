import type { FC, ComponentType } from 'react';
import type { IExecutorItem, TExecutorItemChangeHandler } from 'WorksManagement/Wasaby/Transport/Waybill/interfaces';
import type { ILookupPlaceholderProps } from './LookupPlaceholder';

export interface IExecutorInputProps {
    dataQa?: string;
    item: IExecutorItem;
    onItemChange: TExecutorItemChangeHandler;
    historyId?: string;
    className?: string;
    entities?: string[];
    placeholder?: string;
    label?: string;
    preplaceholder?: string;
    readOnly?: boolean;
    customPlaceholder?: ComponentType<ILookupPlaceholderProps>;
    rightFieldTemplate?: JSX.Element | FC;
}
