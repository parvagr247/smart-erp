package com.smarterp.accounting.ledger.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class LedgerUpdatedEvent extends ApplicationEvent {
    private final UUID ledgerId;
    private final UUID companyId;

    public LedgerUpdatedEvent(Object source, UUID ledgerId, UUID companyId) {
        super(source);
        this.ledgerId = ledgerId;
        this.companyId = companyId;
    }
}
