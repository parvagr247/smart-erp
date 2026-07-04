import useLookupMaster from './useLookupMaster';
import { inventoryService } from '../../inventory.service';

export function useWarehouseListViewData() {
  return useLookupMaster({
    fetchApi: inventoryService.getWarehouses,
    createApi: inventoryService.createWarehouse,
    deleteApi: inventoryService.deleteWarehouse
  });
}

