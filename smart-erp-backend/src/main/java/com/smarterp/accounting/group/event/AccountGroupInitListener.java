package com.smarterp.accounting.group.event;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.administration.company.event.CompanyCreatedEvent;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.group.entity.GroupNature;
import com.smarterp.accounting.group.repository.AccountGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AccountGroupInitListener {

    private final CompanyRepository companyRepository;
    private final AccountGroupRepository groupRepository;

    @EventListener
    @Transactional
    public void onCompanyCreated(CompanyCreatedEvent event) {
        UUID companyId = event.getCompanyId();
        Company company = companyRepository.findById(companyId).orElse(null);
        if (company == null) return;

        // 1. Assets Tree
        AccountGroup assets = createSystemGroup("Assets", GroupNature.ASSET, null, company);
        AccountGroup currentAssets = createSystemGroup("Current Assets", GroupNature.ASSET, assets, company);
        createSystemGroup("Bank Accounts", GroupNature.ASSET, currentAssets, company);
        createSystemGroup("Cash-in-Hand", GroupNature.ASSET, currentAssets, company);
        createSystemGroup("Fixed Assets", GroupNature.ASSET, assets, company);

        // 2. Liabilities Tree
        AccountGroup liabilities = createSystemGroup("Liabilities", GroupNature.LIABILITY, null, company);
        AccountGroup currentLiabilities = createSystemGroup("Current Liabilities", GroupNature.LIABILITY, liabilities, company);
        createSystemGroup("Duties & Taxes", GroupNature.LIABILITY, currentLiabilities, company);
        createSystemGroup("Loans", GroupNature.LIABILITY, liabilities, company);

        // 3. Capital (Equity)
        createSystemGroup("Capital", GroupNature.CAPITAL, null, company);

        // 4. Income Tree
        AccountGroup income = createSystemGroup("Income", GroupNature.INCOME, null, company);
        AccountGroup directIncome = createSystemGroup("Direct Income", GroupNature.INCOME, income, company);
        createSystemGroup("Sales", GroupNature.INCOME, directIncome, company);
        createSystemGroup("Indirect Income", GroupNature.INCOME, income, company);

        // 5. Expense Tree
        AccountGroup expense = createSystemGroup("Expense", GroupNature.EXPENSE, null, company);
        AccountGroup directExpense = createSystemGroup("Direct Expense", GroupNature.EXPENSE, expense, company);
        createSystemGroup("Purchase", GroupNature.EXPENSE, directExpense, company);
        createSystemGroup("Indirect Expense", GroupNature.EXPENSE, expense, company);
    }

    private AccountGroup createSystemGroup(String name, GroupNature nature, AccountGroup parent, Company company) {
        AccountGroup group = AccountGroup.builder()
                .name(name)
                .nature(nature)
                .parentGroup(parent)
                .description("System-generated " + name + " account group.")
                .company(company)
                .isSystemGenerated(true)
                .isActive(true)
                .build();
        return groupRepository.save(group);
    }
}
