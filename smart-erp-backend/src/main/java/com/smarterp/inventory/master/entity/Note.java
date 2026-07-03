package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "entity_notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Note extends BaseEntity {

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = false)
    private String entityType; // e.g. STOCK_ITEM, PARTNER, LEDGER

    @Column(nullable = false)
    private UUID entityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
