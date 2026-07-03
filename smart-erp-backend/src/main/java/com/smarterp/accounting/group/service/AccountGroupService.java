package com.smarterp.accounting.group.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.group.dto.AccountGroupRequest;
import com.smarterp.accounting.group.dto.AccountGroupResponse;
import java.util.List;
import java.util.UUID;

public interface AccountGroupService {

    AccountGroupResponse createGroup(AccountGroupRequest request, Company company);

    AccountGroupResponse updateGroup(UUID id, AccountGroupRequest request, Company company);

    void deleteGroup(UUID id, Company company);

    List<AccountGroupResponse> getGroups(Company company);

    AccountGroupResponse getGroup(UUID id, Company company);
    
    long countGroups(Company company);
}
