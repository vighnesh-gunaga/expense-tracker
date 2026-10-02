package com.example.expensetracker.repository;

import com.example.expensetracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByNameAndUserId(String name, Long userId);

    List<Category> findAllByUserId(Long userId);

    Optional<Category> findByIdAndUserId(Long categoryId, Long userId);

    Optional<Category> findByNameIgnoreCaseAndUserId(
            String name,
            Long userId
    );
}