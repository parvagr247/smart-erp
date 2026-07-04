package com.smarterp.administration.system.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.administration.system.service.BackupRestoreService;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/system")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Company.Update')")
public class BackupRestoreController {

    private final BackupRestoreService service;
    private final CompanyRepository companyRepository;

    @GetMapping("/backup")
    public ResponseEntity<byte[]> downloadBackup(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        byte[] backupBytes = service.generateBackup(company);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=backup_" + company.getName().replaceAll("\\s+", "_") + ".json")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(backupBytes);
    }

    @PostMapping("/restore")
    public ResponseEntity<ApiResponse<Void>> uploadRestore(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam("file") MultipartFile file) {
        Company company = getCompany(companyId);
        try {
            service.restoreBackup(company, file.getBytes());
            return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("System restored successfully.").build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<Void>builder().success(false).message("Failed to restore backup: " + e.getMessage()).build());
        }
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
