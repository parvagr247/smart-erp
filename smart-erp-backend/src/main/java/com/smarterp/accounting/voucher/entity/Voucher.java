package com.smarterp.accounting.voucher.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "vouchers",
    schema = "accounting",
    indexes = {
        @Index(name = "idx_voucher_company_id", columnList = "company_id"),
        @Index(name = "idx_voucher_number", columnList = "voucherNumber"),
        @Index(name = "idx_voucher_date", columnList = "voucherDate"),
        @Index(name = "idx_voucher_type", columnList = "voucherType"),
        @Index(name = "idx_voucher_status", columnList = "status")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String voucherNumber;

    @Column(nullable = false)
    private LocalDate voucherDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoucherType voucherType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoucherStatus status;

    private String narration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private String createdBy;

    @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VoucherLine> lineItems = new ArrayList<>();
}
