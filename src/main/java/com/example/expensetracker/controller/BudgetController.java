package com.example.expensetracker.controller;

import com.example.expensetracker.dto.BudgetRequestDto;
import com.example.expensetracker.dto.BudgetResponseDto;
import com.example.expensetracker.dto.BudgetSummaryResponseDto;
import com.example.expensetracker.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    // CREATE
    @PostMapping("/create")
    public ResponseEntity<BudgetResponseDto> createBudget(
            @Valid @RequestBody BudgetRequestDto request) {

        BudgetResponseDto response =
                budgetService.createBudget(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<BudgetResponseDto>> getAllBudgets() {

        return ResponseEntity.ok(
                budgetService.getAllBudgets()
        );
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponseDto> getBudgetById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                budgetService.getBudgetById(id)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponseDto> updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequestDto request) {

        return ResponseEntity.ok(
                budgetService.updateBudget(id, request)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long id) {

        budgetService.deleteBudget(id);

        return ResponseEntity.noContent().build();
    }

    // BUDGET SUMMARY
    @GetMapping("/{id}/summary")
    public ResponseEntity<BudgetSummaryResponseDto> getBudgetSummary(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                budgetService.getBudgetSummary(id)
        );
    }
}