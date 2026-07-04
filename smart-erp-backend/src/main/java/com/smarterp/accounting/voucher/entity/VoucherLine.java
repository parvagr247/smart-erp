package com.smarterp.accounting.voucher.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.accounting.ledger.entity.Ledger;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(
    name = "voucher_lines",
    schema = "accounting",
    indexes = {
        @Index(name = "idx_vline_voucher_id", columnList = "voucher_id"),
        @Index(name = "idx_vline_ledger_id", columnList = "ledger_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", nullable = false)
    private Voucher voucher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ledger_id", nullable = false)
    private Ledger ledger;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String entryType; // "DEBIT" or "CREDIT"
}
