package com.example.expensetracker.service;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.entity.Transaction;
import com.example.expensetracker.entity.Type;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.UserNotFoundException;
import com.example.expensetracker.repository.BudgetRepository;
import com.example.expensetracker.repository.TransactionRepository;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.SecurityUtil;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.expensetracker.entity.Budget;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    private final BudgetRepository budgetRepository;

    public DashboardService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            SecurityUtil securityUtil, BudgetRepository budgetRepository) {

        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.securityUtil = securityUtil;
        this.budgetRepository = budgetRepository;
    }

    public DashboardResponseDto getDashboard() {

        String email = securityUtil.getCurrentUserEmail();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        BigDecimal totalIncome =
                transactionRepository.getTotalByUserAndType(
                        user.getId(),
                        Type.INCOME
                );

        BigDecimal totalExpense =
                transactionRepository.getTotalByUserAndType(
                        user.getId(),
                        Type.EXPENSE
                );

        BigDecimal balance =
                totalIncome.subtract(totalExpense);

        DashboardResponseDto response =
                new DashboardResponseDto();

        response.setTotalIncome(totalIncome);
        response.setTotalExpense(totalExpense);
        response.setBalance(balance);

        return response;
    }
    public MonthlySummaryResponseDto getMonthlySummary(
            int month,
            int year) {

        String email = securityUtil.getCurrentUserEmail();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        BigDecimal totalIncome =
                transactionRepository.getMonthlyTotalByUserAndType(
                        user.getId(),
                        Type.INCOME,
                        month,
                        year
                );

        BigDecimal totalExpense =
                transactionRepository.getMonthlyTotalByUserAndType(
                        user.getId(),
                        Type.EXPENSE,
                        month,
                        year
                );

        BigDecimal balance =
                totalIncome.subtract(totalExpense);

        MonthlySummaryResponseDto response =
                new MonthlySummaryResponseDto();

        response.setMonth(month);
        response.setYear(year);
        response.setTotalIncome(totalIncome);
        response.setTotalExpense(totalExpense);
        response.setBalance(balance);

        return response;
    }
    public List<CategoryExpenseResponseDto> getCategoryWiseExpenses() {

        String email = securityUtil.getCurrentUserEmail();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        List<Object[]> results =
                transactionRepository.getCategoryWiseTotal(
                        user.getId(),
                        Type.EXPENSE
                );

        return results.stream()
                .map(result -> {

                    CategoryExpenseResponseDto response =
                            new CategoryExpenseResponseDto();

                    response.setCategoryId((Long) result[0]);
                    response.setCategoryName((String) result[1]);
                    response.setTotalExpense((BigDecimal) result[2]);

                    return response;
                })
                .toList();
    }
    public List<BudgetSummaryResponseDto> getBudgetSummary() {

        User user = getCurrentUser();

        List<Budget> budgets =
                budgetRepository.findAllBudgetsForUser(user.getId());

        return budgets.stream()
                .map(budget -> {

                    BigDecimal actualExpense =
                            transactionRepository
                                    .getTotalExpenseForCategoryAndMonth(
                                            user.getId(),
                                            budget.getCategory().getId(),
                                            Type.EXPENSE,
                                            budget.getMonth(),
                                            budget.getYear()
                                    );

                    BigDecimal remainingAmount =
                            budget.getLimitAmount()
                                    .subtract(actualExpense);

                    String status;

                    if (actualExpense.compareTo(
                            budget.getLimitAmount()) > 0) {

                        status = "EXCEEDED";

                    } else {

                        status = "WITHIN_BUDGET";
                    }

                    BudgetSummaryResponseDto response =
                            new BudgetSummaryResponseDto();

                    response.setBudgetId(budget.getId());

                    response.setCategoryId(
                            budget.getCategory().getId());

                    response.setCategoryName(
                            budget.getCategory().getName());

                    response.setBudgetAmount(
                            budget.getLimitAmount());

                    response.setActualExpense(
                            actualExpense);

                    response.setRemainingAmount(
                            remainingAmount);

                    response.setStatus(status);

                    return response;
                })
                .toList();
    }
    private User getCurrentUser() {

        String email =
                securityUtil.getCurrentUserEmail();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User Not Found"));
    }
    public List<TransactionResponseDto> getRecentTransactions(int limit) {

        User user = getCurrentUser();

        if (limit < 1 || limit > 20) {
            throw new IllegalArgumentException(
                    "Limit must be between 1 and 20");
        }

        List<Transaction> transactions =
                transactionRepository.findRecentTransactions(
                        user.getId(),
                        PageRequest.of(0, limit)
                );

        return transactions.stream()
                .map(this::mapTransactionToResponse)
                .toList();
    }
    private TransactionResponseDto mapTransactionToResponse(
            Transaction transaction) {

        TransactionResponseDto response =
                new TransactionResponseDto();

        response.setId(transaction.getId());
        response.setAmount(transaction.getAmount());
        response.setType(transaction.getType());
        response.setDescription(transaction.getDescription());
        response.setDate(transaction.getDate());
        response.setCreatedAt(transaction.getCreatedAt());

        if (transaction.getCategory() != null) {

            response.setCategoryId(
                    transaction.getCategory().getId());

            response.setCategoryName(
                    transaction.getCategory().getName());
        }

        return response;
    }
    public List<TransactionResponseDto> getTransactionsByDate(
            LocalDate date) {

        User user = getCurrentUser();

        List<Transaction> transactions =
                transactionRepository
                        .findAllByUserIdAndDate(
                                user.getId(),
                                date
                        );

        return transactions.stream()
                .map(this::mapTransactionToResponse)
                .toList();
    }



}