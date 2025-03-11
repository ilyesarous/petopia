package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.Ads;
import tn.esprit.petopia_backend.repositories.store.AdsRepository;
import tn.esprit.petopia_backend.services.store.interfaces.IAdsService;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class AdsService implements IAdsService {

    private AdsRepository adsRepository;

    @Override
    public List<Ads> getAllAds() {
        return adsRepository.findAll();
    }

    @Override
    public Ads addAds(Ads ads) {
        ads.setStartDate(new Date());
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DAY_OF_MONTH, 3); // Add 3 days

        ads.setEndDate(calendar.getTime());
        return adsRepository.save(ads);
    }

    @Override
    public void deleteAds(int adsId) {
        adsRepository.deleteById(adsId);
    }

}
