package com.example.expensetracker.controller;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {

        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponseDto> getDashboard() {

        DashboardResponseDto response =
                dashboardService.getDashboard();

        return ResponseEntity.ok(response);
    }
    @GetMapping("/monthly")
    public ResponseEntity<MonthlySummaryResponseDto> getMonthlySummary(
            @RequestParam int month,
            @RequestParam int year) {

        if (month < 1 || month > 12) {
            throw new IllegalArgumentException(
                    "Month must be between 1 and 12");
        }

        if (year < 2000 || year > 2100) {
            throw new IllegalArgumentException(
                    "Year must be between 2000 and 2100");
        }

        MonthlySummaryResponseDto response =
                dashboardService.getMonthlySummary(month, year);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/category-wise")
    public ResponseEntity<List<CategoryExpenseResponseDto>>
    getCategoryWiseExpenses() {

        List<CategoryExpenseResponseDto> response =
                dashboardService.getCategoryWiseExpenses();

        return ResponseEntity.ok(response);
    }
    @GetMapping("/budget-summary")
    public ResponseEntity<List<BudgetSummaryResponseDto>> getBudgetSummary() {

        List<BudgetSummaryResponseDto> response =
                dashboardService.getBudgetSummary();

        return ResponseEntity.ok(response);
    }
    @GetMapping("/recent")
    public ResponseEntity<List<TransactionResponseDto>> getRecentTransactions(
            @RequestParam(defaultValue = "5") int limit) {

        List<TransactionResponseDto> response =
                dashboardService.getRecentTransactions(limit);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/daily")
    public ResponseEntity<List<TransactionResponseDto>>
    getDailyTransactions(
            @RequestParam LocalDate date) {

        return ResponseEntity.ok(
                dashboardService
                        .getTransactionsByDate(date)
        );
    }


}