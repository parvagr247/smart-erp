package com.smarterp.inventory.master.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.dto.InventoryTransactionRequest;
import com.smarterp.inventory.master.dto.InventoryTransactionResponse;
import java.util.List;
import java.util.UUID;

public interface InventoryTransactionService {
    InventoryTransactionResponse recordTransaction(InventoryTransactionRequest request, Company company, String performedBy);
    List<InventoryTransactionResponse> getTransactions(Company company);
    List<InventoryTransactionResponse> getTransactionsByItem(Company company, UUID itemId);
}
