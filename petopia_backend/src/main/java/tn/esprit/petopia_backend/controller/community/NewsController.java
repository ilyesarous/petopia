package tn.esprit.petopia_backend.controller.community;

import tn.esprit.petopia_backend.entities.community.News;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.services.community.INewsScraperService;

import java.util.List;

@RestController
@RequestMapping("/news")
@CrossOrigin(origins = "*")
public class NewsController {

    private final INewsScraperService newsScraperService;

    public NewsController(INewsScraperService newsScraperService) {
        this.newsScraperService = newsScraperService;
    }

    @PostMapping("/scrape")
    public List<News> scrapeAndSave() {
        return newsScraperService.fetchAndSaveNews();
    }

    @GetMapping
    public List<News> getAllNews() {
        return newsScraperService.getAllNews();
    }
}

