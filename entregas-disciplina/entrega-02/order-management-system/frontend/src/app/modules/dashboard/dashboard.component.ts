import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/models';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    template: `
    <div class="container-fluid">
      <h2 class="mb-4">Dashboard</h2>

      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card text-white bg-primary mb-3 shadow-sm">
            <div class="card-header">Total Orders</div>
            <div class="card-body">
              <h5 class="card-title display-4">{{ totalOrders }}</h5>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-success mb-3 shadow-sm">
            <div class="card-header">Total Revenue</div>
            <div class="card-body">
              <h5 class="card-title display-4">{{ totalRevenue | currency }}</h5>
            </div>
          </div>
        </div>
        <div class="col-md-3">
            <div class="card text-white bg-warning mb-3 shadow-sm">
                <div class="card-header">Pending Orders</div>
                <div class="card-body">
                <h5 class="card-title display-4 text-dark">{{ pendingOrders }}</h5>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-white bg-info mb-3 shadow-sm">
                <div class="card-header">Avg. Order Value</div>
                <div class="card-body">
                <h5 class="card-title display-4">{{ averageOrderValue | currency }}</h5>
                </div>
            </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              Orders by Status
            </div>
            <div class="card-body">
              <div style="display: block;">
                <canvas baseChart
                  [data]="barChartData"
                  [options]="barChartOptions"
                  [type]="barChartType">
                </canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
            <div class="card shadow-sm">
                <div class="card-header bg-white">
                    Recent Activity
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" *ngFor="let order of recentOrders">
                        Order #{{ order.id }} - {{ order.status }}
                        <span class="float-end text-muted">{{ order.createdAt | date:'short' }}</span>
                    </li>
                    <li class="list-group-item text-center text-muted" *ngIf="recentOrders.length === 0">
                        No recent activity
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        scales: {
            x: {},
            y: {
                min: 0
            }
        },
        plugins: {
            legend: {
                display: true,
            }
        }
    };
    public barChartType: ChartType = 'bar';
    public barChartData: ChartData<'bar'> = {
        labels: ['OPEN', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELED'],
        datasets: [
            { data: [0, 0, 0, 0, 0], label: 'Orders' }
        ]
    };

    totalOrders = 0;
    totalRevenue = 0;
    pendingOrders = 0;
    averageOrderValue = 0;
    recentOrders: Order[] = [];

    constructor(private orderService: OrderService) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.orderService.getOrders().subscribe({
            next: (page) => {
                const orders = page.content;
                this.processOrders(orders);
            },
            error: (err) => console.error('Failed to load orders', err)
        });
    }

    processOrders(orders: Order[]) {
        this.totalOrders = orders.length;
        this.totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        this.pendingOrders = orders.filter(o => o.status === 'OPEN' || o.status === 'CONFIRMED').length;
        this.averageOrderValue = this.totalOrders > 0 ? this.totalRevenue / this.totalOrders : 0;

        // Sort by ID desc for recent
        this.recentOrders = [...orders].sort((a, b) => b.id - a.id).slice(0, 5);

        // Count by status
        const statusCounts = {
            OPEN: 0,
            CONFIRMED: 0,
            SHIPPED: 0,
            DELIVERED: 0,
            CANCELED: 0
        };

        orders.forEach(order => {
            const status = order.status as keyof typeof statusCounts;
            if (statusCounts[status] !== undefined) {
                statusCounts[status]++;
            }
        });

        this.barChartData.datasets[0].data = [
            statusCounts.OPEN,
            statusCounts.CONFIRMED,
            statusCounts.SHIPPED,
            statusCounts.DELIVERED,
            statusCounts.CANCELED
        ];

        // Trigger update if needed (creating new object usually triggers change detection)
        this.barChartData = { ...this.barChartData };
    }
}
