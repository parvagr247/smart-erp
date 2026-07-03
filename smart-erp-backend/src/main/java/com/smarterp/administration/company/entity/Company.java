package com.smarterp.administration.company.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "companies",
    indexes = {
        @Index(name = "idx_company_gst_number", columnList = "gstNumber"),
        @Index(name = "idx_company_owner_id", columnList = "owner_id"),
        @Index(name = "idx_company_name", columnList = "company_name")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company extends BaseEntity {

    @Column(name = "company_name", nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 15)
    private String gstNumber;

    @Column(nullable = false, length = 10)
    private String panNumber;

    @Column(nullable = false)
    private String financialYear;

    @Column(length = 255)
    private String address;

    private String city;
    private String state;
    private String country;
    private String pincode;
    private String phone;
    private String email;
    private String currency;
    private String logo;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Version
    private Long version;
}
