package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "warehouses",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_id", "code"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse extends BaseEntity {

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<WarehouseSection> sections = new ArrayList<>();

    public void addSection(WarehouseSection section) {
        sections.add(section);
        section.setWarehouse(this);
    }

    public void removeSection(WarehouseSection section) {
        sections.remove(section);
        section.setWarehouse(null);
    }
}
