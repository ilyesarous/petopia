package tn.esprit.petopia_backend.services.community;

import tn.esprit.petopia_backend.entities.community.News;
import tn.esprit.petopia_backend.repositories.community.NewsRepository;
import tn.esprit.petopia_backend.services.community.INewsScraperService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.List;

@Service
public class NewsScraperServiceImpl implements INewsScraperService {

    private final NewsRepository newsRepository;

    public NewsScraperServiceImpl(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @Override
    public List<News> fetchAndSaveNews() {
        List<News> newsList = new ArrayList<>();
        int maxPages = 3; 

        for (int i = 1; i <= maxPages; i++) {
            String url = (i == 1) ? "https://www.petmd.com/news" : "https://www.petmd.com/news/p/" + i;
            try {
                Document doc = Jsoup.connect(url)
                        .userAgent("Mozilla/5.0")
                        .timeout(30000)
                        .get();

                Elements contentBlocks = doc.select("div.article_card_articleContent__t4tWi");
                System.out.println("✅ Page " + i + ": Found articles = " + contentBlocks.size());

                for (Element content : contentBlocks) {
                    String title = content.selectFirst("div.article_card_articleHeading__E8tYm") != null
                            ? content.selectFirst("div.article_card_articleHeading__E8tYm").text()
                            : "";

                    String desc = content.selectFirst("p.article_card_articleExcerpt__YePaX") != null
                            ? content.selectFirst("p.article_card_articleExcerpt__YePaX").text()
                            : "";

                    Element container = content.parent();
                    String imageUrl = "";
                    String articleUrl = "https://www.petmd.com/news";

                    Element img = container.selectFirst("img[src^=https]");
                    if (img != null) imageUrl = img.attr("src");

                    Element link = container.parent().selectFirst("a[href]");
                    if (link != null) {
                        String href = link.attr("href");
                        articleUrl = href.startsWith("http") ? href : "https://www.petmd.com" + href;
                    }

                    // Deduplication check
                    if (!title.isEmpty() && !articleUrl.isEmpty() && !imageUrl.isEmpty() &&
                            !newsRepository.existsByUrl(articleUrl)) {

                        News news = new News(null, title, articleUrl, imageUrl, desc);
                        newsList.add(newsRepository.save(news));
                        System.out.println("🆕 Saved: " + title);
                    } else {
                        System.out.println("⛔ Skipped duplicate or incomplete: " + title);
                    }
                }

            } catch (Exception e) {
                System.err.println("❌ Failed to scrape page " + i + ": " + e.getMessage());
                e.printStackTrace();
            }
        }

        return newsList;
    }


    @Override
    public List<News> getAllNews() {
        return newsRepository.findAll();
    }
    @Scheduled(fixedRate = 600000) // every 10 minutes (600,000 ms)
    public void autoFetchNews() {
        System.out.println("🔄 Scheduled scraping started...");
        fetchAndSaveNews(); 
    }
}
