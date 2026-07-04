import { useNavigate, useParams } from 'react-router-dom';
import { usePartnerForm } from '../../components/services/PartnerFormService';

export function useEditPartnerViewData() {
  const navigate = useNavigate();
  const { id } = useParams();
  const formState = usePartnerForm(id, () => navigate('/inventory/partners/list'));
  return { navigate, formState };
}
