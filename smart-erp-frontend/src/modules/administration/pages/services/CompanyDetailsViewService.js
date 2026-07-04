import { useCompanyDetails } from '../../administration.service';

export function useCompanyDetailsViewData(companyId) {
  const { company, loading, error } = useCompanyDetails(companyId);
  return { company, loading, error };
}

