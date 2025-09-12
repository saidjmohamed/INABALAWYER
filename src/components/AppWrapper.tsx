import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useSession } from '../contexts/SessionContext';
import MaintenancePage from '../pages/MaintenancePage';

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isMaintenanceMode } = useSettings();
  const { session } = useSession();

  if (isMaintenanceMode && !session) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
};