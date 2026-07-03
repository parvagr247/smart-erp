package com.smarterp.accounting.voucher.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.voucher.dto.VoucherRequest;
import com.smarterp.accounting.voucher.dto.VoucherResponse;
import com.smarterp.accounting.voucher.entity.VoucherStatus;
import com.smarterp.accounting.voucher.entity.VoucherType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.UUID;

public interface VoucherService {
    VoucherResponse createVoucher(VoucherRequest request, Company company, String userEmail);
    VoucherResponse updateVoucher(UUID id, VoucherRequest request, Company company, String userEmail);
    VoucherResponse getVoucherById(UUID id, Company company);
    VoucherResponse updateVoucherStatus(UUID id, VoucherStatus status, Company company, String userEmail);
    Page<VoucherResponse> searchAndFilterVouchers(Company company, String search, VoucherType type, VoucherStatus status, LocalDate startDate, LocalDate endDate, Pageable pageable);
    void deleteVoucher(UUID id, Company company);
}
