import React, { forwardRef } from "react";

type HiddenInputProps = {
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const HiddenInput = forwardRef<HTMLInputElement, HiddenInputProps>((props, ref) => {
  const { onKeyDown } = props;

  return (
    <input
      ref={ref}
      type="text"
      //onKeyDown={onKeyDown} // Directly use the onKeyDown prop
      className="absolute opacity-0"
      {...props} // This spreads all props including onFocus, onBlur, etc.
      autoFocus
    />
  );
});

export default HiddenInput