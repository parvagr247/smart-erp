package com.smarterp.inventory.master.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.dto.InventorySummaryResponse;
import com.smarterp.inventory.master.dto.StockItemRequest;
import com.smarterp.inventory.master.dto.StockItemResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

public interface StockItemService {
    StockItemResponse createItem(StockItemRequest request, Company company);
    StockItemResponse updateItem(UUID id, StockItemRequest request, Company company);
    StockItemResponse getItemById(UUID id, Company company);
    void deleteItem(UUID id, Company company);
    Page<StockItemResponse> getItems(Company company, String search, UUID warehouseId, UUID categoryId, UUID groupId, UUID brandId, UUID manufacturerId, String stockStatus, Pageable pageable);
    InventorySummaryResponse getSummary(Company company);
    com.smarterp.inventory.master.entity.StockItem getItemEntity(UUID id, Company company);
}
