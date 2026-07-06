package com.smarterp.accounting.voucher.mapper;

import com.smarterp.accounting.voucher.dto.VoucherLineResponse;
import com.smarterp.accounting.voucher.dto.VoucherResponse;
import com.smarterp.accounting.voucher.entity.Voucher;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class VoucherMapper {

    public VoucherResponse mapToSummaryResponse(Voucher v) {
        return VoucherResponse.builder()
                .id(v.getId())
                .voucherNumber(v.getVoucherNumber())
                .voucherDate(v.getVoucherDate())
                .voucherType(v.getVoucherType())
                .status(v.getStatus())
                .narration(v.getNarration())
                .lineItems(null)
                .createdBy(v.getCreatedBy())
                .createdAt(v.getCreatedAt())
                .build();
    }

    public VoucherResponse mapToResponse(Voucher v) {
        List<VoucherLineResponse> lines = v.getLineItems().stream()
                .map(line -> VoucherLineResponse.builder()
                        .id(line.getId())
                        .ledgerId(line.getLedger().getId())
                        .ledgerName(line.getLedger().getName())
                        .ledgerCode(line.getLedger().getName()) // Using name as code for representation
                        .amount(line.getAmount())
                        .entryType(line.getEntryType())
                        .build())
                .collect(Collectors.toList());

        return VoucherResponse.builder()
                .id(v.getId())
                .voucherNumber(v.getVoucherNumber())
                .voucherDate(v.getVoucherDate())
                .voucherType(v.getVoucherType())
                .status(v.getStatus())
                .narration(v.getNarration())
                .lineItems(lines)
                .createdBy(v.getCreatedBy())
                .createdAt(v.getCreatedAt())
                .build();
    }
}
