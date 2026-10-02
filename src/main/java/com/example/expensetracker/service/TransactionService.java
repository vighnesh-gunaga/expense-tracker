package com.example.expensetracker.service;

import com.example.expensetracker.dto.TransactionRequestDto;
import com.example.expensetracker.dto.TransactionResponseDto;
import com.example.expensetracker.entity.Category;
import com.example.expensetracker.entity.Transaction;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.CategoryNotFoundException;
import com.example.expensetracker.exception.TransactionNotFoundException;
import com.example.expensetracker.exception.UserNotFoundException;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.TransactionRepository;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.SecurityUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    public TransactionService(
            TransactionRepository transactionRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            SecurityUtil securityUtil) {

        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.securityUtil = securityUtil;
    }

    public TransactionResponseDto createTransaction(
            TransactionRequestDto request) {

        String email = securityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        Category category = categoryRepository
                .findByNameAndUserId(
                        request.getCategoryName(),
                        user.getId()
                )
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category Not Found"));

        Transaction transaction = new Transaction();

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        transaction.setCreatedAt(LocalDateTime.now());

        transaction.setUser(user);
        transaction.setCategory(category);

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        return mapToResponse(savedTransaction);
    }

    public List<TransactionResponseDto> getAllTransactions() {

        String email = securityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        return transactionRepository
                .findAllByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TransactionResponseDto getTransactionById(Long id) {

        String email = securityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        Transaction transaction =
                transactionRepository
                        .findByIdAndUserId(id, user.getId())
                        .orElseThrow(() ->
                                new TransactionNotFoundException(
                                        "Transaction Not Found"));

        return mapToResponse(transaction);
    }

    public TransactionResponseDto updateTransaction(
            Long id,
            TransactionRequestDto request) {

        String email = securityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        Transaction transaction =
                transactionRepository
                        .findByIdAndUserId(id, user.getId())
                        .orElseThrow(() ->
                                new CategoryNotFoundException(
                                        "Transaction Not Found"));

        Category category =
                categoryRepository
                        .findByNameAndUserId(
                                request.getCategoryName(),
                                user.getId())
                        .orElseThrow(() ->
                                new CategoryNotFoundException(
                                        "Category Not Found"));

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        transaction.setCategory(category);

        Transaction updatedTransaction =
                transactionRepository.save(transaction);

        return mapToResponse(updatedTransaction);
    }

    public void deleteTransaction(Long id) {

        String email = securityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        Transaction transaction =
                transactionRepository
                        .findByIdAndUserId(id, user.getId())
                        .orElseThrow(() ->
                                new TransactionNotFoundException(
                                        "Transaction Not Found"));

        transactionRepository.delete(transaction);
    }

    private TransactionResponseDto mapToResponse(
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
}