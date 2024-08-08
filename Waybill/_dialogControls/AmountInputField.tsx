import { useRef, forwardRef, ForwardedRef } from 'react';
import { Number } from 'Controls/input';
import { InputContainer } from 'Controls/validate';
import { InfoboxTarget } from 'Controls/popupTargets';

import type { PropsWithChildren, FC } from 'react';
import type { TTagStyle } from 'Controls/interface';

type TValidator = () => true | string;

export interface IAmountInputFieldProps {
    dataQa?: string;
    label?: string;
    className?: string;
    value: number | null;
    onValueChanged: (value: number | null) => void;
    precision: number;
    integersLength: number;
    validators?: TValidator[];
    readOnly?: boolean;
    tagStyle?: TTagStyle;
    infobox?: FC<{ close: Function }>;
    afterInputText?: string;
    inputClassName?: string;
}

const Input = forwardRef(
    (props: PropsWithChildren<IAmountInputFieldProps>, ref: ForwardedRef<HTMLElement>): JSX.Element => {
        return (
            <InputContainer
                {...props}
                forwardedRef={ref}
                data-qa={props.dataQa}
                readOnly={props.readOnly}
                validators={props.validators}
                content={Number}
                className={props.inputClassName}
                precision={props.precision}
                integersLength={props.integersLength}
                onlyPositive={true}
                useGrouping={true}
                showEmptyDecimals={false}
                value={props.value}
                inlineHeight="m"
                tagStyle={props.tagStyle}
                onValueChanged={props.onValueChanged}
                customEvents={NUMBER_INPUT_CUSTOM_EVENTS}
            />
        );
    });

function AmountInputField(props: PropsWithChildren<IAmountInputFieldProps>): JSX.Element {
    const {
        label,
        className,
        children,
        tagStyle,
        infobox: Infobox,
        afterInputText
    } = props;
    const infoboxRef = useRef<InfoboxTarget>(null);

    const closeInfobox = () => infoboxRef.current?.close();

    return (
        <div className={className}>
            {label && (
                <span className="controls-text-label controls-margin_right-s">
                    {label}
                </span>
            )}
            {Infobox
                ? (
                    <InfoboxTarget
                        ref={infoboxRef}
                        floatCloseButton={true}
                        borderStyle="warning"
                        targetSide="top"
                        alignment="end"
                        trigger={tagStyle ? 'hover|touch' : 'demand'}
                        template={(
                            <Infobox close={closeInfobox} />
                        )}
                    >
                        {
                            <Input {...props}/>
                        }
                    </InfoboxTarget>
                )
                : <Input {...props}/>
            }
            {afterInputText && (
                <span
                    className="controls-margin_left-s controls-text-label"
                    title={afterInputText}
                >
                    {afterInputText}
                </span>
            )}

            {children}
        </div>
    );
}

const NUMBER_INPUT_CUSTOM_EVENTS = ['onValueChanged'];

export default AmountInputField;
