// EditableInput.tsx
import React, { useState } from "react";

interface EditableInputProps {
  label: string;
  name: string;
  initialValue: string;
  onUpdate: (value: string) => void;
}

const EditableInput: React.FC<EditableInputProps> = ({
  label,
  name,
  initialValue,
  onUpdate,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onUpdate(newValue); // Notify parent component about the update
  };

  return (
    <div className="flex flex-col gap-y-2 mb-3">
      <label htmlFor={name} className="px-1">
        {label}:
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        name={name}
        className="px-3 py-1 rounded-md border"
      />
    </div>
  );
};

export default EditableInput;
