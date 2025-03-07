package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.Feedback;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.repositories.store.FeedbackRepository;
import tn.esprit.petopia_backend.services.store.interfaces.IFeedbackService;

import edu.stanford.nlp.pipeline.*;
import edu.stanford.nlp.util.CoreMap;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.sentiment.SentimentCoreAnnotations;

import java.util.List;
import java.util.Properties;

@Service
@AllArgsConstructor
public class FeedbackService implements IFeedbackService {
    private FeedbackRepository repository;
    private ProductService productService;

    @Override
    public String addFeedback(Feedback feedback) {
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
            repository.save(feedback);
            return ("Detected Sentiment: " + sentiment);
        }
        return "test";
    }

    @Override
    public Feedback findById(int id) {
        return repository.findById(id).get();
    }

    @Override
    public void deleteById(int id) {
        repository.deleteById(id);
    }

    @Override
    public Feedback updateFeedback(Feedback feedback) {
        return repository.save(feedback);
    }

    @Override
    public List<Feedback> findAllByProduct(int idProduct){
        Product product = productService.findById(idProduct);
        return repository.findByProduct(product);
    }
}
