package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "entity_custom_fields")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomField extends BaseEntity {

    @Column(nullable = false)
    private String fieldName;

    @Column(nullable = false)
    private String fieldType; // TEXT, NUMBER, DATE, BOOLEAN

    private String fieldValue;

    @Column(nullable = false)
    private String entityType; // e.g. STOCK_ITEM, PARTNER, LEDGER

    @Column(nullable = false)
    private UUID entityId;
}
