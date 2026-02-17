package com.edu.ordersystem.controller;

import com.edu.ordersystem.dto.OrderRequestDTO;
import com.edu.ordersystem.dto.OrderResponseDTO;
import com.edu.ordersystem.model.OrderStatus;
import com.edu.ordersystem.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order Management APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Create a new order")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody OrderRequestDTO orderRequest,
            Authentication authentication) {
        return new ResponseEntity<>(orderService.createOrder(orderRequest, authentication.getName()),
                HttpStatus.CREATED);
    }

    @Operation(summary = "Get all orders (Admin/Viewer) or My Orders (User)")
    @GetMapping
    public ResponseEntity<Page<OrderResponseDTO>> getAllOrders(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            Authentication authentication) {

        boolean isAdminOrViewer = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_VIEWER"));

        if (isAdminOrViewer) {
            return ResponseEntity.ok(orderService.findAll(pageable));
        } else {
            return ResponseEntity.ok(orderService.findMyOrders(authentication.getName(), pageable));
        }
    }

    @Operation(summary = "Update order status")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    @Operation(summary = "Delete an order")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id, Authentication authentication) {
        orderService.deleteOrder(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update an order")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> updateOrder(@PathVariable Long id,
            @Valid @RequestBody OrderRequestDTO orderRequest,
            Authentication authentication) {
        return ResponseEntity.ok(orderService.updateOrder(id, orderRequest, authentication.getName()));
    }

    @Operation(summary = "Get order by ID")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrder(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(orderService.getOrder(id, authentication.getName()));
    }
}
