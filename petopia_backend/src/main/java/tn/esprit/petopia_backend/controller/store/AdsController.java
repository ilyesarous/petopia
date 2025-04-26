package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.store.Ads;
import tn.esprit.petopia_backend.entities.store.StatusType;
import tn.esprit.petopia_backend.services.store.AdsService;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@AllArgsConstructor
public class AdsController {
    private AdsService adsService;

    @GetMapping("admin/ads")
    public List<Ads> getAllAds() {
        return adsService.getAllAds();
    }

    @GetMapping("user/ads")
    public List<Ads> getAllAdsUser() {
        return adsService.getAllAds();
    }

    @PostMapping(path = "admin/ads/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Ads addAds(@RequestParam("imageUrl") MultipartFile file,
                      @RequestParam("description") String description,
                      @RequestParam("status") String status,
                      @RequestParam("title") String title,
                      @RequestParam("startDate") String startDate,
                      @RequestParam("endDate") String endDate
    ) {
        Ads ads = new Ads();
        ads.setTitle(title);
        ads.setDescription(description);
        ads.setStatus(StatusType.valueOf(status));
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date date = sdf.parse(startDate);
            Date date1 = sdf.parse(endDate);
            ads.setStartDate(date);
            ads.setEndDate(date1);
        } catch (
                ParseException e) {
            throw new RuntimeException(e);
        }

        return adsService.addAds(file, ads);
    }

    @DeleteMapping("admin/ads/delete/{id}")
    public void deleteAds(@PathVariable int id) {
        adsService.deleteAds(id);
    }
}
