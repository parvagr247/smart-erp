import useLookupMaster from './useLookupMaster';
import { inventoryService } from '../../services/inventory.service';

export function useUnitListViewData() {
  return useLookupMaster({
    fetchApi: inventoryService.getUnits,
    createApi: inventoryService.createUnit,
    deleteApi: inventoryService.deleteUnit
  });
}
