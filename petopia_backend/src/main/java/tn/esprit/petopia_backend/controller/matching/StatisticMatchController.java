package tn.esprit.petopia_backend.controller.matching;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.petopia_backend.dto.StatisticsDTOmatch;
import tn.esprit.petopia_backend.services.matching.StatisticsMatchService;


@RestController
@RequestMapping("/admin/stats")
public class StatisticMatchController {
    @Autowired
    private StatisticsMatchService statisticsService;

    @GetMapping("/matches")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<StatisticsDTOmatch> getMatchStatistics() {
        StatisticsDTOmatch stats = statisticsService.getMatchStatistics();
        return ResponseEntity.ok(stats);
    }
}
