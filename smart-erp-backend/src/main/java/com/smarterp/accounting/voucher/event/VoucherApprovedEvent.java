package com.smarterp.accounting.voucher.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class VoucherApprovedEvent extends ApplicationEvent {
    private final UUID voucherId;
    private final UUID companyId;

    public VoucherApprovedEvent(Object source, UUID voucherId, UUID companyId) {
        super(source);
        this.voucherId = voucherId;
        this.companyId = companyId;
    }
}
