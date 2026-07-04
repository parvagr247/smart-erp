import { useNavigate } from 'react-router-dom';

export function useNotFoundViewData() {
  const navigate = useNavigate();
  return {
    handleBackHome: () => navigate('/')
  };
}
