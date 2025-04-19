package tn.esprit.petopia_backend.entities.store;

import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PartnerDashboardStats {
    private int totalSales;
    private double totalRevenue;
    private double averageRating;
    private List<Product> topSellingProducts;
    private List<Float> listTotalByProduct = new ArrayList<>();
}
