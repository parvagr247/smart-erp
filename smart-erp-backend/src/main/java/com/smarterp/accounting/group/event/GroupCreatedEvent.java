package com.smarterp.accounting.group.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class GroupCreatedEvent extends ApplicationEvent {
    private final UUID groupId;
    private final UUID companyId;

    public GroupCreatedEvent(Object source, UUID groupId, UUID companyId) {
        super(source);
        this.groupId = groupId;
        this.companyId = companyId;
    }
}
