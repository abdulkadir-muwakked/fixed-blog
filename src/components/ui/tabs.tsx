import React from "react";

export const Tabs = ({
  children,
  defaultValue,
  className,
}: {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}) => (
  <div className={`tabs ${className || ""}`} data-default-value={defaultValue}>
    {children}
  </div>
);

export const TabsList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`tabs-list flex space-x-2 ${className || ""}`}>
    {children}
  </div>
);

export const TabsTrigger = ({
  children,
  onClick,
  value,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  value?: string;
}) => (
  <button
    className="tabs-trigger px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
    onClick={onClick}
    data-value={value}
  >
    {children}
  </button>
);

export const TabsContent = ({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value?: string;
  className?: string;
}) => (
  <div className={`tabs-content mt-4 ${className || ""}`} data-value={value}>
    {children}
  </div>
);
