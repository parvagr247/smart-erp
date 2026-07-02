package com.smarterp.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company extends BaseEntity{

    @Column(nullable = false, length = 100)
    private String companyName;

    @Column(nullable = false, unique = true, length = 15)
    private String gstNumber;

    @Column(nullable = false)
    private String financialYear;

    @Column(length = 255)
    private String address;

    private String state;

    private String phone;

    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

}
