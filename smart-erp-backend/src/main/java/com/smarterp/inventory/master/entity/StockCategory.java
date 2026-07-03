package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "stock_categories",
    schema = "inventory",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_id", "name"})
    },
    indexes = {
        @Index(name = "idx_stock_category_company_name", columnList = "company_id, name")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockCategory extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
