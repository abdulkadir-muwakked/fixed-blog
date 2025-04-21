import React from "react";

export const Tabs = ({ children }: { children: React.ReactNode }) => (
  <div className="tabs">{children}</div>
);

export const TabsList = ({ children }: { children: React.ReactNode }) => (
  <div className="tabs-list flex space-x-2">{children}</div>
);

export const TabsTrigger = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    className="tabs-trigger px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
    onClick={onClick}
  >
    {children}
  </button>
);

export const TabsContent = ({ children }: { children: React.ReactNode }) => (
  <div className="tabs-content mt-4">{children}</div>
);
