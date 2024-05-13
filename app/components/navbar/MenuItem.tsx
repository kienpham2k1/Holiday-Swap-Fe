'use client';

import React from 'react';
import { IconType } from 'react-icons';

interface MenuItemProps {
  onClick?: () => void;
  icon: IconType;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, icon: Icon, label }) => {
  return (
    <div
      onClick={onClick}
      className="px-4 flex flex-row items-center w-full gap-1 py-3 hover:bg-neutral-100 transition font-semibold"
    >
      <Icon size={18} />
      {label}
    </div>
  );
};

export default MenuItem;
