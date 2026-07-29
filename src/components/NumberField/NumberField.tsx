import { forwardRef } from 'react';

import { TextField, type TextFieldProps } from '../TextField/TextField.js';

export type NumberFieldProps = Omit<TextFieldProps, 'type'>;

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
    { testId, ...props },
    ref,
) {
    return <TextField ref={ref} type="number" inputMode="decimal" testId={testId} {...props} />;
});
