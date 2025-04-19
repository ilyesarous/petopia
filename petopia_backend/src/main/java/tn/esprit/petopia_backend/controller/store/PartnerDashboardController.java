package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.store.PartnerDashboardStats;
import tn.esprit.petopia_backend.services.store.PartnerDashboardService;

import java.util.List;

@RestController
@RequestMapping("partner/dashboard")
@AllArgsConstructor
public class PartnerDashboardController {
    private PartnerDashboardService partnerDashboardService;

    @GetMapping("{idUser}")
    public PartnerDashboardStats getPartnerDashboard(@PathVariable int idUser) {
        return partnerDashboardService.getPartnerDashboardStats(idUser);
    }
}
