package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(
    name = "entity_attachments",
    schema = "common"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment extends BaseEntity {

    @Column(nullable = false)
    private String fileName;

    private String fileType; // e.g. PDF, IMAGE

    @Column(nullable = false)
    private String fileUrl;

    @Column(nullable = false)
    private String entityType; // e.g. STOCK_ITEM, PARTNER, LEDGER

    @Column(nullable = false)
    private UUID entityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
