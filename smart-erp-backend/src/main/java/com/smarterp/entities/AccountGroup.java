package com.smarterp.entities;


import com.smarterp.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ledger_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountGroup extends BaseEntity {

    @Column(nullable = false)
    private String groupName;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

}
