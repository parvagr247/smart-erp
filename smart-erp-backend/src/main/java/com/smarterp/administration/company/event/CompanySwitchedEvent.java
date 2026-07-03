package com.smarterp.administration.company.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.util.UUID;

@Getter
public class CompanySwitchedEvent extends ApplicationEvent {
    private final UUID companyId;
    private final UUID userId;

    public CompanySwitchedEvent(Object source, UUID companyId, UUID userId) {
        super(source);
        this.companyId = companyId;
        this.userId = userId;
    }
}
