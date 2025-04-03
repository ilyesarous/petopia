package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.Feedback;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.store.FeedbackRepository;
import tn.esprit.petopia_backend.repositories.store.ProductRepository;
import tn.esprit.petopia_backend.services.store.interfaces.IFeedbackService;

import edu.stanford.nlp.pipeline.*;
import edu.stanford.nlp.util.CoreMap;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.sentiment.SentimentCoreAnnotations;
import tn.esprit.petopia_backend.services.user.UserService;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

@Service
@AllArgsConstructor
public class FeedbackService implements IFeedbackService {
    private FeedbackRepository repository;
    private ProductRepository productRepository;
    private ProductService productService;
    private UserService userService;

    @Override
    public String addFeedback(int idProduct, Feedback feedback) {
        feedback.setCreatedAt(new Date());
// Load CoreNLP pipeline with sentiment analysis
        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,pos,lemma,parse,sentiment");
        StanfordCoreNLP pipeline = new StanfordCoreNLP(props);

        // Process text
        Annotation annotation = new Annotation(feedback.getDescription());
        pipeline.annotate(annotation);

        // Extract sentiment
        for (CoreMap sentence : annotation.get(CoreAnnotations.SentencesAnnotation.class)) {
            String sentiment = sentence.get(SentimentCoreAnnotations.SentimentClass.class);
            System.out.println("Sentence: " + sentence);
            feedback.setSentiment(sentiment);
            User user = userService.getUsersById(1).getOurUsers();
            Product product = productService.findById(idProduct);
            feedback.setUser(user);
            feedback.setProduct(product);
            repository.save(feedback);
            List<Feedback> feedbacks = repository.findByProduct(product);
            float sum = (float) feedbacks.stream()
                    .mapToDouble(Feedback::getStars_number)
                    .sum();
            product.setRating(sum / feedbacks.size());
            product.setReview_count(feedbacks.size());
            productRepository.save(product);

            return ("Detected Sentiment: " + sentiment);
        }
        return "test";
    }

    @Override
    public Feedback findById(int id) {
        return repository.findById(id).get();
    }

    @Override
    public List<String> getSentimentById(int idProduct) {
        List<String> sentiments = new ArrayList<>();
        findAllByProduct(idProduct).forEach(f -> sentiments.add(f.getSentiment()));
        return sentiments;
    }

    @Override
    public void deleteById(int id) {
        repository.deleteById(id);
    }

    @Override
    public Feedback updateFeedback(Feedback feedback) {
        Feedback feedback1 = findById(feedback.getFeedback_id());
        feedback1.setDescription(feedback.getDescription());
        feedback1.setUpdatedAt(new Date());
        return repository.save(feedback1);
    }

    @Override
    public List<Feedback> findAllByProduct(int idProduct) {
        Product product = productService.findById(idProduct);
        return repository.findByProduct(product);
    }
}
