import useLookupMaster from './useLookupMaster';
import { inventoryService } from '../../inventory.service';

export function useManufacturerListViewData() {
  return useLookupMaster({
    fetchApi: inventoryService.getManufacturers,
    createApi: inventoryService.createManufacturer,
    deleteApi: inventoryService.deleteManufacturer
  });
}

