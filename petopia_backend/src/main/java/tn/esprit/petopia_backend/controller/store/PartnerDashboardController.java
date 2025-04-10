package tn.esprit.petopia_backend.controller.store;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.petopia_backend.entities.store.CartProduct;
import tn.esprit.petopia_backend.entities.store.PartnerDashboardStats;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.entities.store.ProductCategory;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.store.CartProductRepository;
import tn.esprit.petopia_backend.repositories.store.ProductRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("partner/dashboard")
@RequiredArgsConstructor
public class PartnerDashboardController {
    private final ProductRepository productRepository;
    private final CartProductRepository cartProductRepository;
    private final UserRepository userRepository;

    @GetMapping("/stats/{partnerId}")
    public ResponseEntity<PartnerDashboardStats> getDashboardStats(@PathVariable Integer partnerId) {
        PartnerDashboardStats stats = new PartnerDashboardStats();

        User user = userRepository.findById(partnerId).get();
        // Product statistics
        List<Product> partnerProducts = productRepository.findByUser(user);
        stats.setTotalProducts(partnerProducts.size());
        stats.setOutOfStockProducts((int) partnerProducts.stream()
                .filter(p -> p.getAvailableQuantity() <= 0)
                .count());

        // Sales statistics
        List<CartProduct> soldProducts = cartProductRepository.findByProductUserId(partnerId);
        System.out.println(soldProducts.size());
        stats.setTotalSales(soldProducts.stream()
                .mapToInt(CartProduct::getQuantity)
                .sum());
        stats.setTotalRevenue(soldProducts.stream()
                .mapToDouble(cp -> cp.getProduct().getProduct_price() * cp.getQuantity())
                .sum());
        stats.setAverageRating(soldProducts.stream()
                .mapToDouble(cp -> cp.getProduct().getRating())
                .sum()/soldProducts.size());

        // Category distribution
        Map<ProductCategory, Long> categoryDistribution = partnerProducts.stream()
                .collect(Collectors.groupingBy(Product::getCategory, Collectors.counting()));
        stats.setCategoryDistribution(categoryDistribution);

        // Top-selling products
        Map<String, Integer> topSelling = soldProducts.stream()
                .collect(Collectors.groupingBy(
                        cp -> cp.getProduct().getProduct_name(),
                        Collectors.summingInt(CartProduct::getQuantity)
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
        stats.setTopSellingProducts(topSelling);

        System.out.println(stats.getTopSellingProducts());

        return ResponseEntity.ok(stats);
    }
}