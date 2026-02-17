package com.edu.ordersystem.dto;

import com.edu.ordersystem.model.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponseDTO {
    private Long id;
    private String userEmail;
    private LocalDateTime createdAt;
    private OrderStatus status;
    private BigDecimal total;
    private List<OrderItemDTO> items;
}
