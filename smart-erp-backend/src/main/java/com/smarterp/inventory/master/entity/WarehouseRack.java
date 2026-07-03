package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "warehouse_racks",
    schema = "inventory"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseRack extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private WarehouseSection section;

    @OneToMany(mappedBy = "rack", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<WarehouseBin> bins = new ArrayList<>();

    public void addBin(WarehouseBin bin) {
        bins.add(bin);
        bin.setRack(this);
    }

    public void removeBin(WarehouseBin bin) {
        bins.remove(bin);
        bin.setRack(null);
    }
}
