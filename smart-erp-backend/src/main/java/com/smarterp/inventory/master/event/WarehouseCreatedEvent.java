package com.smarterp.inventory.master.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class WarehouseCreatedEvent extends ApplicationEvent {
    private final UUID warehouseId;
    private final UUID companyId;
    private final String name;

    public WarehouseCreatedEvent(Object source, UUID warehouseId, UUID companyId, String name) {
        super(source);
        this.warehouseId = warehouseId;
        this.companyId = companyId;
        this.name = name;
    }
}
