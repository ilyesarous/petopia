package tn.esprit.petopia_backend.services.store.interfaces;

import tn.esprit.petopia_backend.entities.store.Ads;

import java.util.List;

public interface IAdsService {
    List<Ads> getAllAds();
    Ads addAds(Ads ads);
    void deleteAds(int adsId);
}
