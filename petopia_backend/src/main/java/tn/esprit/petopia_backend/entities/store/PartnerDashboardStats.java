package tn.esprit.petopia_backend.entities.store;

import lombok.Data;

import java.util.Map;

@Data
public class PartnerDashboardStats {
    private int totalProducts;
    private int outOfStockProducts;
    private int totalSales;
    private double totalRevenue;
    private double averageRating;
    private Map<ProductCategory, Long> categoryDistribution;
    private Map<String, Integer> topSellingProducts;
}
