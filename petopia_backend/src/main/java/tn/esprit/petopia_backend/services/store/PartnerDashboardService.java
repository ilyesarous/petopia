package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.PartnerDashboardStats;

@Service
@AllArgsConstructor
public class PartnerDashboardService {
    private CartService cartService;
    private ProductService productService;
    private CartProductService cartProductService;

    public PartnerDashboardStats getPartnerDashboardStats(int idUser) {
        PartnerDashboardStats partnerDashboardStats = new PartnerDashboardStats();
        partnerDashboardStats.setTopSellingProducts(cartService.getBestSaledProductsByUser(idUser));
        partnerDashboardStats.setTotalRevenue(cartProductService.getTotalSalesByUser(idUser));
        partnerDashboardStats.setAverageRating(productService.getAvrageRatingByUser(idUser));
        partnerDashboardStats.setTotalSales(cartProductService.getTotalSales(idUser));
        System.out.println(partnerDashboardStats.toString());
        return partnerDashboardStats;
    }
}
