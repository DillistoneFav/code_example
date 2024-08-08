import { Title as BaseTitle } from 'Controls/heading';

import type { PropsWithChildren } from 'react';

export interface ITitleProps {
    className?: string;
    caption: string;
}

function Title({ className, caption }: PropsWithChildren<ITitleProps>): JSX.Element {
    return (
        <BaseTitle
            className={className}
            fontSize="m"
            fontColorStyle="secondary"
            caption={caption}
            readOnly
        />
    );
}

export default Title;
