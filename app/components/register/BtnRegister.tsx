import React from 'react';

interface ButtonRegsiterProps {
  onClick?: () => void;
  label: string;
  disabled?: boolean;
}

const ButtonRegister: React.FC<ButtonRegsiterProps> = ({ onClick, label, disabled }) => {
  return (
    <div className="flex flex-row items-center justify-center">
      <button
        disabled={disabled}
        onClick={onClick}
        className="bg-[#5C98F2] px-24 py-2 my-2 text-white rounded-md"
      >
        {label}
      </button>
    </div>
  );
};

export default ButtonRegister;
