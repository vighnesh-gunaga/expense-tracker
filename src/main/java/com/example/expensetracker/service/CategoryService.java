package com.example.expensetracker.service;

import com.example.expensetracker.dto.CategoryRequestDto;
import com.example.expensetracker.dto.CategoryResponseDto;
import com.example.expensetracker.entity.Category;
import com.example.expensetracker.entity.Type;
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

    public void createDefaultCategories(User user) {

        List<String> categories;

        switch (user.getUserType()) {

            case STUDENT -> categories = List.of(
                    "Food",
                    "Transport",
                    "Education",
                    "Books & Stationery",
                    "Hostel/Rent",
                    "Mobile & Internet",
                    "Entertainment",
                    "Shopping",
                    "Health",
                    "Personal Care",
                    "Travel",
                    "Other"
            );

            case WORKING_PROFESSIONAL -> categories = List.of(
                    "Food",
                    "Groceries",
                    "Rent/Home",
                    "Transport/Fuel",
                    "Utilities",
                    "Mobile & Internet",
                    "Shopping",
                    "Entertainment",
                    "Health",
                    "Insurance",
                    "Investments/Savings",
                    "Travel",
                    "Personal Care",
                    "Other"
            );

            case BUSINESS_OWNER -> categories = List.of(
                    "Food",
                    "Transport",
                    "Office",
                    "Business Supplies",
                    "Employee Expenses",
                    "Utilities",
                    "Marketing",
                    "Travel",
                    "Shopping",
                    "Health",
                    "Business Services",
                    "Other"
            );

            case FREELANCER -> categories = List.of(
                    "Food",
                    "Transport",
                    "Workspace",
                    "Internet",
                    "Software & Tools",
                    "Equipment",
                    "Client Expenses",
                    "Travel",
                    "Shopping",
                    "Health",
                    "Entertainment",
                    "Other"
            );

            default -> categories = List.of(
                    "Food",
                    "Transport",
                    "Shopping",
                    "Entertainment",
                    "Health",
                    "Other"
            );
        }

        for (String categoryName : categories) {

            Category category = new Category();

            category.setName(categoryName);
            category.setType(Type.EXPENSE);
            category.setUser(user);

            categoryRepository.save(category);
        }
    }
}