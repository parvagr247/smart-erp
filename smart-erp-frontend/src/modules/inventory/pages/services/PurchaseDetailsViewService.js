import { useNavigate, useParams } from 'react-router-dom';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';
import usePurchaseDetails from './usePurchaseDetails';

export function usePurchaseDetailsViewData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeCompany } = useActiveCompany();

  const details = usePurchaseDetails(id, () => navigate('/inventory/purchases'));

  const isIntraState = () => {
    if (!details.purchase) return true;
    return details.purchase.cgst > 0 || details.purchase.sgst > 0 || details.purchase.igst === 0;
  };

  return { id, navigate, activeCompany, details, isIntraState };
}
