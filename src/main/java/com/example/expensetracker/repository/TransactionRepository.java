package com.example.expensetracker.repository;

import com.example.expensetracker.entity.Transaction;
import com.example.expensetracker.entity.Type;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByIdAndUserId(Long transactionId, Long userId);

    List<Transaction> findAllByUserId(Long userId);

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId
        AND t.type = :type
        """)
    BigDecimal getTotalByUserAndType(
            @Param("userId") Long userId,
            @Param("type") Type type
    );

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId
        AND t.type = :type
        AND MONTH(t.date) = :month
        AND YEAR(t.date) = :year
        """)
    BigDecimal getMonthlyTotalByUserAndType(
            @Param("userId") Long userId,
            @Param("type") Type type,
            @Param("month") int month,
            @Param("year") int year
    );
    @Query("""
        SELECT t.category.id,
               t.category.name,
               COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId
        AND t.type = :type
        GROUP BY t.category.id, t.category.name
        ORDER BY SUM(t.amount) DESC
        """)
    List<Object[]> getCategoryWiseTotal(
            @Param("userId") Long userId,
            @Param("type") Type type
    );

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId
        AND t.category.id = :categoryId
        AND t.type = :type
        AND MONTH(t.date) = :month
        AND YEAR(t.date) = :year
        """)
    BigDecimal getTotalExpenseForCategoryAndMonth(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("type") Type type,
            @Param("month") int month,
            @Param("year") int year
    );

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId
        AND t.type = :type
        AND MONTH(t.date) = :month
        AND YEAR(t.date) = :year
        """)
    BigDecimal getMonthlyTotal(
            @Param("userId") Long userId,
            @Param("type") Type type,
            @Param("month") int month,
            @Param("year") int year
    );
    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.user.id = :userId
        ORDER BY t.date DESC, t.createdAt DESC
        """)
    List<Transaction> findRecentTransactions(
            @Param("userId") Long userId,
            Pageable pageable
    );

    @Query("""
    SELECT t
    FROM Transaction t
    WHERE t.user.id = :userId
    AND t.date = :date
    ORDER BY t.createdAt DESC
    """)
    List<Transaction> findAllByUserIdAndDate(
            @Param("userId") Long userId,
            @Param("date") LocalDate date
    );


}