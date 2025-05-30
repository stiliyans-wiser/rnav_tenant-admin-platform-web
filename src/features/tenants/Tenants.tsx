import { PageContainer } from '../layout/components/page/PageContainer';
import PageHeader from '../layout/components/page/PageHeader';
import { ClientTableContainer } from '../layout/components/table/ClientTableContainer';
import { TenantsTable } from './TenantsTable.tsx';

export const Tenants = () => {
  return (
    <PageContainer>
      <PageHeader titleKey="Tenants" />
      {/*<PageHeader titleKey="Tenants" actionChildren={<RolesTableControls />} />*/}

      <ClientTableContainer
        filterChildren={null}
        tableChildren={<TenantsTable  />}
      />
    </PageContainer>
  );
};

export default Tenants; 
