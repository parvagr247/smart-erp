import { useNavigate } from 'react-router-dom';
import { usePartnerForm } from '../../components/services/partner.service';

export function useCreatePartnerViewData() {
  const navigate = useNavigate();
  const formState = usePartnerForm(null, () => navigate('/inventory/partners/list'));
  return { navigate, formState };
}
