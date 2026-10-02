package com.example.expensetracker.repository;

import com.example.expensetracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findAllByUserId(Long userId);

    Optional<Budget> findByIdAndUserId(Long budgetId, Long userId);

    Optional<Budget> findByCategoryIdAndMonthAndYearAndUserId(
            Long categoryId,
            Integer month,
            Integer year,
            Long userId
    );

    @Query("""
        SELECT b
        FROM Budget b
        WHERE b.user.id = :userId
        ORDER BY b.year DESC, b.month DESC
        """)
    List<Budget> findAllBudgetsForUser(
            @Param("userId") Long userId
    );
}