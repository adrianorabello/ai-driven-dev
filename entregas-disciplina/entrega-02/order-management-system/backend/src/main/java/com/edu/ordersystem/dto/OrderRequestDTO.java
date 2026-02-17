package com.edu.ordersystem.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    @NotEmpty(message = "Order must have at least one item")
    private List<OrderItemRequestDTO> items;
}
