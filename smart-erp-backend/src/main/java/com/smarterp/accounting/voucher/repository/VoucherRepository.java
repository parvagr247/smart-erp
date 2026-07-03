package com.smarterp.accounting.voucher.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.voucher.entity.Voucher;
import com.smarterp.accounting.voucher.entity.VoucherType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, UUID>, JpaSpecificationExecutor<Voucher> {

    @Query("SELECT MAX(v.voucherNumber) FROM Voucher v WHERE v.company = :company AND v.voucherType = :type AND v.voucherNumber LIKE :prefix")
    String findMaxVoucherNumberByCompanyAndTypeAndPrefix(
            @Param("company") Company company, 
            @Param("type") VoucherType type, 
            @Param("prefix") String prefix
    );

    long countByCompany(Company company);
}
