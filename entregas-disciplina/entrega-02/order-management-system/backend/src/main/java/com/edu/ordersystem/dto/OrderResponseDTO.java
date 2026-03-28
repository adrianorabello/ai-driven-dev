package com.edu.ordersystem.dto;

import com.edu.ordersystem.model.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(
    Long id,
    String userEmail,
    LocalDateTime createdAt,
    OrderStatus status,
    BigDecimal total,
    List<OrderItemDTO> items
) {}
