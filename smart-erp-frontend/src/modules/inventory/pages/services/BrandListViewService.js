import useLookupMaster from './useLookupMaster';
import { inventoryService } from '../../inventory.service';

export function useBrandListViewData() {
  return useLookupMaster({
    fetchApi: inventoryService.getBrands,
    createApi: inventoryService.createBrand,
    deleteApi: inventoryService.deleteBrand
  });
}

