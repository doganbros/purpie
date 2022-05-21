import { PickerProps } from "emoji-mart";
import React from "react";

/**
 * This is the Props definition of EmojiTextArea.
 *
 * @interface EmojiTextAreaProps
 *
 * @member {React.RefObject<HTMLTextAreaElement>} ref Function used to get the content of the textarea.
 * @member {number} rows Specifying rows for textarea.
 * @member {number} cols Specifying cols for textarea.
 * @member {React.CSSProperties} style Specifying the style of a textarea.
 * @member {string} placeholder Specifying a placeholder for a textarea.
 * @member {boolean} showPicker Toggle the display of emoji-mart's Picker.
 * @member {PickerProps} emojiPickerProps Specify the props for emoji-mart's Picker. onSelect is used in react-emoji-textarea.
 * @member {function} onClick Function to determine that a textarea field has been clicked.
 * @member {function} onSuggesting Function to determine while an emoji input candidate is displayed.
 * @member {function} onChange Function used to get the content of the textarea.
 */
export interface EmojiTextAreaProps {
    /** Function used to get the content of the textarea. */
    ref?: React.RefObject<HTMLTextAreaElement>;
    /** Specifying rows for textarea. */
    rows?: number;
    /** Specifying cols for textarea. */
    cols?: number;
    /** Specifying the style of a textarea. */
    style?: React.CSSProperties;
    /** Specifying a placeholder for a textarea. */
    placeholder?: string;
    /** Toggle the display of emoji-mart's Picker. */
    showPicker?: boolean;
    /** Specify the props for emoji-mart's Picker. onSelect is used in react-emoji-textarea. */
    emojiPickerProps?: PickerProps;
    /** Function to determine that a textarea field has been clicked. */
    onClick?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
    /** Function to determine while an emoji input candidate is displayed. */
    onSuggesting?: (val: boolean) => void;
    /** Function used to get the content of the textarea. */
    onChange: (val: string) => void;
}
declare const _default: React.ForwardRefExoticComponent<EmojiTextAreaProps>;
export default _default;
