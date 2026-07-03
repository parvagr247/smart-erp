package com.smarterp.administration.company.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class CompanyCreatedEvent extends ApplicationEvent {
    private final UUID companyId;

    public CompanyCreatedEvent(Object source, UUID companyId) {
        super(source);
        this.companyId = companyId;
    }
}
