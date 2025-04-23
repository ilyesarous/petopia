package tn.esprit.petopia_backend.services.community;

import tn.esprit.petopia_backend.entities.community.News;

import java.util.List;

public interface INewsScraperService {
    List<News> fetchAndSaveNews();
    List<News> getAllNews();
}
