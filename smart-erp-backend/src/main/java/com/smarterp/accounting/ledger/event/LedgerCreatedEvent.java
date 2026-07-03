package com.smarterp.accounting.ledger.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class LedgerCreatedEvent extends ApplicationEvent {
    private final UUID ledgerId;
    private final UUID companyId;

    public LedgerCreatedEvent(Object source, UUID ledgerId, UUID companyId) {
        super(source);
        this.ledgerId = ledgerId;
        this.companyId = companyId;
    }
}
