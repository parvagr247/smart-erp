package com.smarterp.auth.entity;


import com.smarterp.common.entity.BaseEntity;

import com.smarterp.auth.entity.enums.Role;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
    name = "users",
    schema = "app_auth",
    indexes = {
        @Index(name = "idx_user_email", columnList = "email")
    }
)
@SQLDelete(sql = "UPDATE users SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    @Builder.Default
    private Boolean enabled = true;

    @OneToMany(mappedBy = "owner")
    @Builder.Default
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Company> companies = new ArrayList<>();
}


