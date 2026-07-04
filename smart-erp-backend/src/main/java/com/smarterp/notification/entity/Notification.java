package com.smarterp.notification.entity;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
    name = "notifications",
    schema = "administration",
    indexes = {
        @Index(name = "idx_notification_company", columnList = "company_id"),
        @Index(name = "idx_notification_user", columnList = "user_email")
    }
)
@SQLDelete(sql = "UPDATE administration.notifications SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean read = false;

    @Column(name = "user_email")
    private String userEmail;

    @Column(nullable = true)
    @Builder.Default
    private String priority = "MEDIUM";

    @Column(nullable = true)
    @Builder.Default
    private String iconType = "info";
}
