package com.edu.ordersystem.service;

import com.edu.ordersystem.dto.OrderRequestDTO;
import com.edu.ordersystem.dto.OrderResponseDTO;
import com.edu.ordersystem.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponseDTO createOrder(OrderRequestDTO orderRequest, String userEmail);

    Page<OrderResponseDTO> findAll(Pageable pageable);

    Page<OrderResponseDTO> findMyOrders(String userEmail, Pageable pageable);

    Page<OrderResponseDTO> findAllowedOrders(String userEmail, Pageable pageable);

    OrderResponseDTO updateStatus(Long id, OrderStatus status);

    void deleteOrder(Long id, String userEmail);

    OrderResponseDTO updateOrder(Long id, OrderRequestDTO orderRequest, String userEmail);

    OrderResponseDTO getOrder(Long id, String userEmail);
}
