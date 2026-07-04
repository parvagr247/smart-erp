package com.smarterp.administration.system.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.accounting.voucher.repository.VoucherRepository;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BackupRestoreService {

    private final LedgerRepository ledgerRepository;
    private final VoucherRepository voucherRepository;
    private final StockItemRepository stockItemRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public byte[] generateBackup(Company company) {
        log.info("Generating system data backup for company: {}", company.getId());
        try {
            Map<String, Object> backupData = new HashMap<>();
            backupData.put("companyId", company.getId());
            backupData.put("ledgers", ledgerRepository.findByCompany(company));
            backupData.put("vouchers", voucherRepository.findAll((root, query, cb) -> cb.equal(root.get("company"), company)));
            backupData.put("stockItems", stockItemRepository.findAll((root, query, cb) -> cb.equal(root.get("company"), company)));

            String json = objectMapper.writeValueAsString(backupData);
            return json.getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Failed to generate backup", e);
            return "{}".getBytes(StandardCharsets.UTF_8);
        }
    }

    public void restoreBackup(Company company, byte[] backupBytes) {
        log.info("Restoring system data backup for company: {}", company.getId());
        try {
            String json = new String(backupBytes, StandardCharsets.UTF_8);
            Map<?, ?> backupData = objectMapper.readValue(json, Map.class);
            log.info("Parsed backup file. Data keys present: {}", backupData.keySet());
        } catch (Exception e) {
            log.error("Failed to restore backup", e);
        }
    }
}
