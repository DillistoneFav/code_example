import { forwardRef } from 'react';
import { Link as LookupLink } from 'Controls/lookup';
import { consts } from 'Addressee/common';
import * as rk from 'i18n!WorksManagement';

export interface ILookupPlaceholderProps {
    onClick: (tabKey: string) => void;
}

const LookupPlaceholder = forwardRef<HTMLDivElement, ILookupPlaceholderProps>(
    ({ onClick }, ref) => {
        return (
            <div className={'ws-flexbox ws-align-items-baseline'} ref={ref}>
                {rk('Выберите')}&nbsp;
                <LookupLink
                    caption={rk('сотрудника')}
                    onLinkClick={() => onClick(consts.TAB_KEY.EMPLOYEE)}
                />
                &nbsp;{rk('или')}&nbsp;
                <LookupLink
                    caption={rk('контрагента')}
                    onLinkClick={() => onClick(consts.TAB_KEY.CLIENT)}
                />
            </div>
        );
    }
);

export default LookupPlaceholder;
