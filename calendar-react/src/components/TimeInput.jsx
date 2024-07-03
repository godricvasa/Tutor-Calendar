// TimeInput.js
import React from "react";
import { format } from "date-fns";

const TimeInput = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded border-2 border-green-300 focus:border-green-500 focus:ring-opacity-50"
      placeholder="Enter time (hh:mm AM/PM)"
    />
  );
};

export default TimeInput;
