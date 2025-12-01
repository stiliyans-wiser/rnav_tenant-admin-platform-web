import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { AdminConfig } from '@/features/tenants/interfaces/admin-config.interface';

interface TenantContextType {
  accountId: string;
  adminConfig: AdminConfig;
  documentTypes: DocumentType[];
  setAccountId: (accountId: string) => void;
  setAdminConfig: (config: AdminConfig) => void;
  setDocumentTypes: (documents: DocumentType[]) => void;
}

const CreateTenantContext = createContext<TenantContextType>(undefined);

export const CreateTenantProvider = ({ children }: { children: ReactNode }) => {
  const [accountId, setAccountId] = useState<string>(null);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>();
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

  return (
    <CreateTenantContext.Provider
      value={{
        accountId,
        adminConfig,
        documentTypes,
        setAccountId,
        setAdminConfig,
        setDocumentTypes,
      }}
    >
      {children}
    </CreateTenantContext.Provider>
  );
};

export const useCreateTenantContext = (): TenantContextType => {
  const context = useContext(CreateTenantContext);

  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }

  return context;
};
