package com.smarterp.common.security;

import com.smarterp.auth.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.ArrayList;

@RequiredArgsConstructor
@Getter
public class AuthenticatedUser implements UserDetails {

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        switch (user.getRole()) {
            case ADMIN -> {
                authorities.add(new SimpleGrantedAuthority("Company.Create"));
                authorities.add(new SimpleGrantedAuthority("Company.Update"));
                authorities.add(new SimpleGrantedAuthority("Company.Delete"));
                authorities.add(new SimpleGrantedAuthority("Company.View"));
                authorities.add(new SimpleGrantedAuthority("Purchase.Create"));
                authorities.add(new SimpleGrantedAuthority("Purchase.Approve"));
                authorities.add(new SimpleGrantedAuthority("Purchase.Cancel"));
                authorities.add(new SimpleGrantedAuthority("Purchase.Delete"));
                authorities.add(new SimpleGrantedAuthority("Sales.Create"));
                authorities.add(new SimpleGrantedAuthority("Sales.Approve"));
                authorities.add(new SimpleGrantedAuthority("Sales.Cancel"));
                authorities.add(new SimpleGrantedAuthority("Sales.Print"));
                authorities.add(new SimpleGrantedAuthority("Inventory.Create"));
                authorities.add(new SimpleGrantedAuthority("Inventory.Update"));
                authorities.add(new SimpleGrantedAuthority("Inventory.Transfer"));
                authorities.add(new SimpleGrantedAuthority("Inventory.Adjust"));
                authorities.add(new SimpleGrantedAuthority("Accounting.CreateVoucher"));
                authorities.add(new SimpleGrantedAuthority("Accounting.ApproveVoucher"));
                authorities.add(new SimpleGrantedAuthority("Accounting.ViewReports"));
                authorities.add(new SimpleGrantedAuthority("Administration.Users"));
                authorities.add(new SimpleGrantedAuthority("Administration.Roles"));
                authorities.add(new SimpleGrantedAuthority("Administration.Settings"));
                
                // Report permissions
                authorities.add(new SimpleGrantedAuthority("REPORT_TRIAL_BALANCE_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_BALANCE_SHEET_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_PROFIT_LOSS_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_INVENTORY_VALUATION_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_STOCK_REGISTER_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_CASH_BOOK_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_DAY_BOOK_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_GST_SUMMARY_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_OUTSTANDING_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_CASH_FLOW_VIEW"));
            }
            case ACCOUNTANT -> {
                authorities.add(new SimpleGrantedAuthority("Company.View"));
                authorities.add(new SimpleGrantedAuthority("Purchase.Create"));
                authorities.add(new SimpleGrantedAuthority("Purchase.Cancel"));
                authorities.add(new SimpleGrantedAuthority("Sales.Create"));
                authorities.add(new SimpleGrantedAuthority("Sales.Cancel"));
                authorities.add(new SimpleGrantedAuthority("Sales.Print"));
                authorities.add(new SimpleGrantedAuthority("Accounting.CreateVoucher"));
                authorities.add(new SimpleGrantedAuthority("Accounting.ApproveVoucher"));
                authorities.add(new SimpleGrantedAuthority("Accounting.ViewReports"));
                
                // Report permissions
                authorities.add(new SimpleGrantedAuthority("REPORT_TRIAL_BALANCE_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_BALANCE_SHEET_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_PROFIT_LOSS_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_CASH_BOOK_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_DAY_BOOK_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_GST_SUMMARY_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_CASH_FLOW_VIEW"));
            }
            case INVENTORY_MANAGER -> {
                authorities.add(new SimpleGrantedAuthority("Company.View"));
                authorities.add(new SimpleGrantedAuthority("Purchase.Create"));
                authorities.add(new SimpleGrantedAuthority("Purchase.Approve"));
                authorities.add(new SimpleGrantedAuthority("Purchase.Cancel"));
                authorities.add(new SimpleGrantedAuthority("Sales.Create"));
                authorities.add(new SimpleGrantedAuthority("Sales.Approve"));
                authorities.add(new SimpleGrantedAuthority("Sales.Cancel"));
                authorities.add(new SimpleGrantedAuthority("Sales.Print"));
                authorities.add(new SimpleGrantedAuthority("Inventory.Create"));
                authorities.add(new SimpleGrantedAuthority("Inventory.Update"));
                authorities.add(new SimpleGrantedAuthority("Inventory.Transfer"));
                authorities.add(new SimpleGrantedAuthority("Inventory.Adjust"));
                
                // Report permissions
                authorities.add(new SimpleGrantedAuthority("REPORT_INVENTORY_VALUATION_VIEW"));
                authorities.add(new SimpleGrantedAuthority("REPORT_STOCK_REGISTER_VIEW"));
            }
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getEnabled();
    }
}
