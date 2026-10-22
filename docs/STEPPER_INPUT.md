# StepperInput

`StepperInput` combines a decimal text field with decrement and increment buttons. Manual values commit on blur or Enter; Escape restores the controlled value. Commas and decimal points are accepted. `step` controls the buttons and arrow keys, and does not force manual input onto a grid: typing `1.234` with `step={0.1}` keeps `1.234`.

```tsx
const [quantity, setQuantity] = useState<number | null>(null);

<StepperInput
    allowEmpty
    value={quantity}
    onChange={setQuantity}
    min={0}
    step={0.1}
    shiftStep={1}
    ctrlShiftStep={10}
    ariaLabel="Minimum stock"
    placeholder="Not set"
    fullWidth
    size={2}
/>
```

- Without `allowEmpty`, `value` and `onChange` remain strictly numeric. Clearing then leaving the field restores its controlled value.
- With `allowEmpty`, clearing commits `null`. The clear button is shown by default; `clearable={false}` hides that button while keyboard clearing remains available. Empty is distinct from zero. Stepping from empty starts at zero, then applies the step and bounds.
- `Shift` uses `shiftStep` (default `10 × step`). `Ctrl+Shift` or `Cmd+Shift` uses `ctrlShiftStep` (default `100 × step`). Modifiers work with both buttons and `ArrowUp` / `ArrowDown`.
- `min` / `max` clamp committed values. Manual precision is independent from step size. Values that cannot be represented by JavaScript numbers without changing their decimal value are rejected and the previous value is restored.
- `readOnly` disables changing or clearing; `disabled` also removes controls from normal keyboard navigation. Native field props such as `id`, `name`, `required`, `aria-describedby`, `onFocus` and `onBlur` are forwarded to the input. `ariaLabel` and native `aria-label` are both supported.
- `fullWidth` fills the parent while leaving buttons compact. The default is an intrinsic-width control. `size` supports the same sizes as `TextField`.

Step buttons use the shared `Tooltip`, localized by `OrcestrUiProvider locale="en"` / `"ru"`. Tooltips explain the base step and modifier steps. Pass `showStepTooltips={false}` to hide them, or customize both buttons with `stepTooltip`:

```tsx
<StepperInput allowEmpty value={quantity} onChange={setQuantity}
    stepTooltip={({direction, step, shiftStep, ctrlShiftStep}) =>
        `${direction}: ${step}; Shift: ${shiftStep}; Ctrl+Shift: ${ctrlShiftStep}`} />
```

`decreaseLabel` / `increaseLabel` customize the accessible button names. Labels never use browser-native `title` tooltips. Locale copy can also be overridden through `copy.common.stepBy` and `copy.common.stepModifiers`.
