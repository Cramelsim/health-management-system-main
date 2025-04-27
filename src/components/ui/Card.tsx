import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className,
  footer,
  noPadding = false,
}) => {
  return (
    <div className={clsx('bg-white rounded-lg shadow-md overflow-hidden', className)}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-4'}>{children}</div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};