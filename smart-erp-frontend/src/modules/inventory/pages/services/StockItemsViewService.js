import { useNavigate } from 'react-router-dom';
import { useItemList } from './useItemList';

export function useStockItemsViewData() {
  const navigate = useNavigate();
  const listState = useItemList();
  return { navigate, ...listState };
}
