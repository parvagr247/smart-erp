import useLookupMaster from './useLookupMaster';
import { inventoryService } from '../../inventory.service';

export function useCategoryListViewData() {
  return useLookupMaster({
    fetchApi: inventoryService.getCategories,
    createApi: inventoryService.createCategory,
    deleteApi: inventoryService.deleteCategory
  });
}

