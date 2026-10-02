package com.example.expensetracker.service;

import com.example.expensetracker.dto.BudgetRequestDto;
import com.example.expensetracker.dto.BudgetResponseDto;
import com.example.expensetracker.dto.BudgetSummaryResponseDto;
import com.example.expensetracker.entity.Budget;
import com.example.expensetracker.entity.Category;
import com.example.expensetracker.entity.Type;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.BudgetNotFoundException;
import com.example.expensetracker.exception.CategoryNotFoundException;
import com.example.expensetracker.exception.DuplicateBudgetException;
import com.example.expensetracker.exception.UserNotFoundException;
import com.example.expensetracker.repository.BudgetRepository;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.TransactionRepository;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.SecurityUtil;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    private final TransactionRepository transactionRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            SecurityUtil securityUtil, TransactionRepository transactionRepository) {

        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.securityUtil = securityUtil;
        this.transactionRepository = transactionRepository;
    }

    // CREATE
    public BudgetResponseDto createBudget(
            BudgetRequestDto request) {

        User user = getCurrentUser();

        Category category = categoryRepository
                .findByNameAndUserId(
                        request.getCategoryName(),
                        user.getId()
                )
                .orElseThrow(() ->
                        new CategoryNotFoundException(
                                "Category Not Found"));

        boolean alreadyExists =
                budgetRepository
                        .findByCategoryIdAndMonthAndYearAndUserId(
                                category.getId(),
                                request.getMonth(),
                                request.getYear(),
                                user.getId()
                        )
                        .isPresent();

        if (alreadyExists) {
            throw new DuplicateBudgetException(
                    "Budget already exists for this category and month");
        }

        Budget budget = new Budget();

        budget.setLimitAmount(request.getLimitAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        budget.setUser(user);
        budget.setCategory(category);
        budget.setCreatedAt(LocalDateTime.now());

        Budget savedBudget =
                budgetRepository.save(budget);

        return mapToResponse(savedBudget);
    }

    // READ ALL
    public List<BudgetResponseDto> getAllBudgets() {

        User user = getCurrentUser();

        return budgetRepository
                .findAllByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // READ ONE
    public BudgetResponseDto getBudgetById(Long id) {

        User user = getCurrentUser();

        Budget budget =
                budgetRepository
                        .findByIdAndUserId(
                                id,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new BudgetNotFoundException(
                                        "Budget Not Found"));

        return mapToResponse(budget);
    }

    // UPDATE
    public BudgetResponseDto updateBudget(
            Long id,
            BudgetRequestDto request) {

        User user = getCurrentUser();

        Budget budget =
                budgetRepository
                        .findByIdAndUserId(
                                id,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new BudgetNotFoundException(
                                        "Budget Not Found"));

        Category category =
                categoryRepository
                        .findByNameAndUserId(
                                request.getCategoryName(),
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new CategoryNotFoundException(
                                        "Category Not Found"));

        budget.setLimitAmount(request.getLimitAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        budget.setCategory(category);

        Budget updatedBudget =
                budgetRepository.save(budget);

        return mapToResponse(updatedBudget);
    }

    // DELETE
    public void deleteBudget(Long id) {

        User user = getCurrentUser();

        Budget budget =
                budgetRepository
                        .findByIdAndUserId(
                                id,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new BudgetNotFoundException(
                                        "Budget Not Found"));

        budgetRepository.delete(budget);
    }

    // CURRENT USER
    private User getCurrentUser() {

        String email =
                securityUtil.getCurrentUserEmail();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User Not Found"));
    }

    // ENTITY → RESPONSE DTO
    private BudgetResponseDto mapToResponse(
            Budget budget) {

        BudgetResponseDto response =
                new BudgetResponseDto();

        response.setId(budget.getId());
        response.setLimitAmount(
                budget.getLimitAmount());
        response.setMonth(
                budget.getMonth());
        response.setYear(
                budget.getYear());

        if (budget.getCategory() != null) {

            response.setCategoryId(
                    budget.getCategory().getId());

            response.setCategoryName(
                    budget.getCategory().getName());
        }

        return response;
    }
    // BUDGET SUMMARY
    public BudgetSummaryResponseDto getBudgetSummary(Long id) {

        User user = getCurrentUser();

        Budget budget =
                budgetRepository
                        .findByIdAndUserId(
                                id,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new BudgetNotFoundException(
                                        "Budget Not Found"));

        BigDecimal budgetAmount =
                budget.getLimitAmount();

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
                budgetAmount.subtract(actualExpense);

        String status;

        if (actualExpense.compareTo(budgetAmount) < 0) {

            status = "Within Budget";

        } else if (actualExpense.compareTo(budgetAmount) == 0) {

            status = "Budget Reached";

        } else {

            status = "Over Budget";
        }

        BudgetSummaryResponseDto response =
                new BudgetSummaryResponseDto();

        response.setBudgetId(budget.getId());

        response.setCategoryId(
                budget.getCategory().getId()
        );

        response.setCategoryName(
                budget.getCategory().getName()
        );

        response.setBudgetAmount(
                budgetAmount
        );

        response.setActualExpense(
                actualExpense
        );

        response.setRemainingAmount(
                remainingAmount
        );

        response.setStatus(status);

        return response;
    }
}