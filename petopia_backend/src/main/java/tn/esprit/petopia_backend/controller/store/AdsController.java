package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.store.Ads;
import tn.esprit.petopia_backend.services.store.AdsService;

import java.util.List;

@RestController
@RequestMapping("admin/ads")
@AllArgsConstructor
public class AdsController {
    private AdsService adsService;

    @GetMapping
    public List<Ads> getAllAds() {
        return adsService.getAllAds();
    }

    @PostMapping("add")
    public Ads addAds(@RequestBody Ads ads) {
        return adsService.addAds(ads);
    }

    @DeleteMapping("delete/{id}")
    public void deleteAds(@PathVariable int id) {
        adsService.deleteAds(id);
    }
}
