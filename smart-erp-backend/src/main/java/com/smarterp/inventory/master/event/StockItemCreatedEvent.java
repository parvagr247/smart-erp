package com.smarterp.inventory.master.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class StockItemCreatedEvent extends ApplicationEvent {
    private final UUID itemId;
    private final UUID companyId;
    private final String name;

    public StockItemCreatedEvent(Object source, UUID itemId, UUID companyId, String name) {
        super(source);
        this.itemId = itemId;
        this.companyId = companyId;
        this.name = name;
    }
}
