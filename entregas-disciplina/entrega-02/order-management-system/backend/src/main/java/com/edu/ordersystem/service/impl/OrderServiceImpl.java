package com.edu.ordersystem.service.impl;

import com.edu.ordersystem.dto.OrderItemDTO;
import com.edu.ordersystem.dto.OrderRequestDTO;
import com.edu.ordersystem.dto.OrderResponseDTO;
import com.edu.ordersystem.exception.ResourceNotFoundException;
import com.edu.ordersystem.exception.OrderAccessDeniedException;
import com.edu.ordersystem.model.*;
import com.edu.ordersystem.repository.OrderRepository;
import com.edu.ordersystem.repository.ProductRepository;
import com.edu.ordersystem.repository.UserRepository;
import com.edu.ordersystem.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO orderRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.OPEN);

        List<OrderItem> items = orderRequest.items().stream().map(itemRequest -> {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Product not found: " + itemRequest.productId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setPrice(product.getPrice()); // Snapshot price
            return orderItem;
        }).toList();

        order.setItems(items);
        order.calculateTotal(); // Removed domain logic from service

        Order savedOrder = orderRepository.save(order);
        return mapToDTO(savedOrder);
    }

    @Override
    public Page<OrderResponseDTO> findAll(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    public Page<OrderResponseDTO> findMyOrders(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return orderRepository.findByUserId(user.getId(), pageable).map(this::mapToDTO);
    }

    @Override
    public Page<OrderResponseDTO> findAllowedOrders(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        boolean isAdminOrViewer = user.getRoles().stream()
                .anyMatch(r -> r.equals(RoleName.ROLE_ADMIN) || r.equals(RoleName.ROLE_VIEWER));

        if (isAdminOrViewer) {
            return orderRepository.findAll(pageable).map(this::mapToDTO);
        } else {
            return orderRepository.findByUserId(user.getId(), pageable).map(this::mapToDTO);
        }
    }

    @Override
    @Transactional
    public OrderResponseDTO updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(status);
        return mapToDTO(orderRepository.save(order));
    }

    private OrderResponseDTO mapToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream().map(item -> new OrderItemDTO(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getQuantity(),
                item.getPrice(),
                item.calculateSubTotal()
        )).toList();

        return new OrderResponseDTO(
                order.getId(),
                order.getUser().getEmail(),
                order.getCreatedAt(),
                order.getStatus(),
                order.getTotal(),
                itemDTOs
        );
    }

    @Override
    @Transactional
    public void deleteOrder(Long id, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        verifyOrderOwnership(order, user);

        if (order.getStatus() != OrderStatus.OPEN) {
            throw new OrderAccessDeniedException("Order cannot be deleted because it is not in OPEN status");
        }

        orderRepository.delete(order);
    }

    @Override
    @Transactional
    public OrderResponseDTO updateOrder(Long id, OrderRequestDTO orderRequest, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        verifyOrderOwnership(order, user);

        if (order.getStatus() != OrderStatus.OPEN) {
            throw new OrderAccessDeniedException("Order cannot be updated because it is not in OPEN status");
        }

        // Clear existing items (orphan removal should handle deletion if configured,
        // but explicit clear is safer here)
        order.getItems().clear();

        List<OrderItem> items = orderRequest.items().stream().map(itemRequest -> {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Product not found: " + itemRequest.productId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setPrice(product.getPrice()); // Snapshot price
            return orderItem;
        }).toList();

        order.getItems().addAll(items);
        order.calculateTotal(); // domain logic

        return mapToDTO(orderRepository.save(order));
    }

    @Override
    public OrderResponseDTO getOrder(Long id, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        verifyOrderOwnership(order, user);
        return mapToDTO(order);
    }

    private void verifyOrderOwnership(Order order, User user) {
        if (!order.getUser().getId().equals(user.getId()) &&
                user.getRoles().stream().noneMatch(r -> r.equals(RoleName.ROLE_ADMIN))) {
            throw new OrderAccessDeniedException("You are not authorized to access or modify this order");
        }
    }
}
