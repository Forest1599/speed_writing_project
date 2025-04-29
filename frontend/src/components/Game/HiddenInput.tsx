import React, { forwardRef } from "react";

type HiddenInputProps = {
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;   // ✅ Add this
  onBlur: () => void;    // ✅ Add this
};

const HiddenInput = forwardRef<HTMLInputElement, HiddenInputProps>((props, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      className="absolute opacity-0"
      {...props} // This spreads all props including onFocus, onBlur, etc.
      autoFocus
    />
  );
});

export default HiddenInput