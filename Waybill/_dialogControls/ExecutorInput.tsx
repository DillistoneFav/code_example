import { useMemo, useRef } from 'react';
import { Input as AddresseeInput } from 'Addressee/field';
import { consts } from 'Addressee/common';
import { View as PersonPhoto } from 'Person/photo';
import { Organization } from 'WorksManagement/Wasaby/Transport/Waybill/dialog';
import cn from 'FMCore/classnames';
import {
    ADDRESSEE_INPUT_CUSTOM_EVENTS,
    ENTITIES,
    MAX_VISIBLE_ITEMS,
    MIN_SEARCH_LENGTH
} from './ExecutorInput/constants';
import { addresseeModelToExecutorItem } from './ExecutorInput/utils';

import type { IExecutorInputProps } from './ExecutorInput/interfaces';

import 'css!WorksManagement/Wasaby/Transport/Waybill/dialogControls';

function ExecutorInput({
    dataQa,
    className,
    item,
    onItemChange,
    entities = ENTITIES,
    placeholder,
    preplaceholder,
    customPlaceholder: CustomPlaceholderComponent,
    label,
    readOnly,
    historyId,
    rightFieldTemplate
}: IExecutorInputProps): JSX.Element {
    const executorId = item?.id ?? null;
    const isContractor = Boolean(item) && item.type !== consts.CLIENT_TYPE.INDIVIDUAL;
    const addresseeInputRef = useRef(null);

    const onLookupLinkClick = (tabKey: string): void => {
        const config = { templateOptions: { selectedTab: tabKey } };
        addresseeInputRef.current.showSelector(config);
    };

    const handleSelectedItemsChanged = (selectedItems): void => {
        const executor = selectedItems.at(0);
        if (!executor) {
            onItemChange(null);
            return;
        }

        if (executorId === executor.get('id')) {
            return;
        }

        onItemChange(addresseeModelToExecutorItem(executor));
    };

    const items = useMemo(() => {
        if (!item) {
            return [];
        }

        return [
            {
                '@Лицо': item.id,
                Название: item.name,
                KeyType: isContractor
                    ? consts.TAB_KEY.COMPANY
                    : consts.TAB_KEY.EMPLOYEE
            }
        ];
    }, [item]);

    const entitiesConfig = useMemo(() => {
        return [
            {
                key: consts.TAB_KEY.CLIENT,
                historyId: `${consts.TAB_KEY.CLIENT}_${historyId}`,
                tabTemplateOptions: {
                    selectionType: 'leaf'
                }
            },
            {
                key: consts.TAB_KEY.COMPANY,
                historyId: `${consts.TAB_KEY.COMPANY}_${historyId}`,
                tabTemplateOptions: {
                    selectionType: 'leaf'
                }
            },
            {
                key: consts.TAB_KEY.EMPLOYEE,
                historyId: `${consts.TAB_KEY.EMPLOYEE}_${historyId}`,
                tabTemplateOptions: {
                    selectionType: 'leaf'
                }
            }
        ];
    }, [historyId]);

    const customPlaceholderTemplate = CustomPlaceholderComponent
       ? (<CustomPlaceholderComponent onClick={onLookupLinkClick} />)
       : undefined;

    // TODO: вынести шаблон с полем ввода в отдельный компонент, чтобы разбить ExecutorInput
    if (readOnly && isContractor) {
        const employeeName = item.externalEmployee?.fullName;

        return (
            <div data-qa={dataQa} className={cn(className, 'ETTControl-ExecutorInput')}>
                <Organization className="tw-truncate" name={item.name} id={item.id} />
                {employeeName && (
                    <span className="controls-fontsize-xs controls-text-unaccented" title={employeeName}>
                        {employeeName}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div data-qa={dataQa} className="tw-flex tw-w-full tw-items-baseline">
            {item && !isContractor && (
                <PersonPhoto
                    className="controls-margin_right-s"
                    photoId={item.photoId}
                    photoSize="s"
                    fullName={item.name}
                    activityVisible={false}
                />
            )}
            <AddresseeInput
                ref={addresseeInputRef}
                readOnly={readOnly}
                selectedKeys={executorId ? [executorId] : []}
                className={cn(className, 'tw-flex-grow tw-truncate')}
                entities={entities}
                maxVisibleItems={MAX_VISIBLE_ITEMS}
                minSearchLength={MIN_SEARCH_LENGTH}
                autoDropDown={true}
                initialItems={items}
                label={label}
                labelPosition="inline"
                labelUnderline="fixed"
                placeholder={placeholder}
                preplaceholder={preplaceholder}
                customPlaceholder={customPlaceholderTemplate}
                placeholderVisibility="empty"
                itemFontColorStyle="secondary"
                lookupAddEntity={true}
                itemFontSize="l"
                rightFieldTemplate={rightFieldTemplate}
                onlyAddress={false}
                needAddress={false}
                needContract={false}
                onSelectedItemsChanged={handleSelectedItemsChanged}
                customEvents={ADDRESSEE_INPUT_CUSTOM_EVENTS}
                entitiesConfig={entitiesConfig}
            />
        </div>
    );
}

export default ExecutorInput;
