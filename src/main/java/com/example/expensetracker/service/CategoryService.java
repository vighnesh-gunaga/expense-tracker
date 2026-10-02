package com.example.expensetracker.service;

import com.example.expensetracker.dto.CategoryRequestDto;
import com.example.expensetracker.dto.CategoryResponseDto;
import com.example.expensetracker.entity.Category;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.CategoryNotFoundException;
import com.example.expensetracker.exception.UserNotFoundException;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.SecurityUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    public CategoryService(
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            SecurityUtil securityUtil) {

        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.securityUtil = securityUtil;
    }

    // CREATE
    public CategoryResponseDto createCategory(
            CategoryRequestDto request) {

        User user = getCurrentUser();

        Category category = new Category();

        category.setName(request.getName());
        category.setType(request.getType());

        // Category belongs to logged-in user
        category.setUser(user);

        Category savedCategory =
                categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    // READ ALL
    public List<CategoryResponseDto> getAllCategories() {

        User user = getCurrentUser();

        return categoryRepository
                .findAllByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // READ ONE
    public CategoryResponseDto getCategoryById(Long id) {

        User user = getCurrentUser();

        Category category =
                categoryRepository
                        .findByIdAndUserId(id, user.getId())
                        .orElseThrow(() ->
                                new CategoryNotFoundException(
                                        "Category Not Found"));

        return mapToResponse(category);
    }

    public CategoryResponseDto getCategoryByName(String name) {

        User user = getCurrentUser();

        Category category =
                categoryRepository
                        .findByNameIgnoreCaseAndUserId(
                                name,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new CategoryNotFoundException(
                                        "Category Not Found"
                                )
                        );

        return mapToResponse(category);
    }



    // UPDATE
    public CategoryResponseDto updateCategory(
            Long id,
            CategoryRequestDto request) {

        User user = getCurrentUser();

        Category category =
                categoryRepository
                        .findByIdAndUserId(id, user.getId())
                        .orElseThrow(() ->
                                new CategoryNotFoundException(
                                        "Category Not Found"));

        category.setName(request.getName());
        category.setType(request.getType());

        Category updatedCategory =
                categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    // DELETE
    public void deleteCategory(Long id) {

        User user = getCurrentUser();

        Category category =
                categoryRepository
                        .findByIdAndUserId(id, user.getId())
                        .orElseThrow(() ->
                                new CategoryNotFoundException(
                                        "Category Not Found"));

        categoryRepository.delete(category);
    }

    // Get currently authenticated user
    private User getCurrentUser() {

        String email =
                securityUtil.getCurrentUserEmail();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User Not Found"));
    }

    // Entity → Response DTO
    private CategoryResponseDto mapToResponse(
            Category category) {

        CategoryResponseDto response =
                new CategoryResponseDto();

        response.setId(category.getId());
        response.setName(category.getName());
        response.setType(category.getType());

        return response;
    }
}