package com.edu.ordersystem.config;

import com.edu.ordersystem.model.Product;
import com.edu.ordersystem.model.RoleName;
import com.edu.ordersystem.model.User;
import com.edu.ordersystem.repository.ProductRepository;
import com.edu.ordersystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Seed Users
            if (!userRepository.existsByEmail("admin@example.com")) {
                User admin = User.builder()
                        .name("Admin User")
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("admin123"))
                        .roles(Set.of(RoleName.ROLE_ADMIN))
                        .build();
                userRepository.save(admin);
            }

            if (!userRepository.existsByEmail("user@example.com")) {
                User user = User.builder()
                        .name("Regular User")
                        .email("user@example.com")
                        .password(passwordEncoder.encode("user123"))
                        .roles(Set.of(RoleName.ROLE_USER))
                        .build();
                userRepository.save(user);
            }

            if (!userRepository.existsByEmail("viewer@example.com")) {
                User viewer = User.builder()
                        .name("Viewer User")
                        .email("viewer@example.com")
                        .password(passwordEncoder.encode("viewer123"))
                        .roles(Set.of(RoleName.ROLE_VIEWER))
                        .build();
                userRepository.save(viewer);
            }

            // Seed Products
            if (productRepository.count() == 0) {
                productRepository.save(Product.builder().name("Laptop").description("High performance laptop")
                        .price(new BigDecimal("2500.00")).build());
                productRepository.save(Product.builder().name("Mouse").description("Wireless mouse")
                        .price(new BigDecimal("50.00")).build());
                productRepository.save(Product.builder().name("Keyboard").description("Mechanical keyboard")
                        .price(new BigDecimal("120.00")).build());
                productRepository.save(Product.builder().name("Monitor").description("27 inch 4K monitor")
                        .price(new BigDecimal("400.00")).build());
            }
        };
    }
}
