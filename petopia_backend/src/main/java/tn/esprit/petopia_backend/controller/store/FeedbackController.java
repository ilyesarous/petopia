package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.store.Feedback;
import tn.esprit.petopia_backend.services.store.FeedbackService;

import java.util.List;

@RestController
@RequestMapping
@AllArgsConstructor
public class FeedbackController {
    private FeedbackService feedbackService;

    @GetMapping("user/feedback/{id}")
    public Feedback findById(@PathVariable int id) {
        return feedbackService.findById(id);
    }

    @GetMapping("user/feedback/getByProduct/{id}")
    public List<Feedback> findByProduct(@PathVariable int id) {
        return feedbackService.findAllByProduct(id);
    }

    @GetMapping("user/feedback/get/{idProduct}")
    public List<String> findSentimentsByProduct(@PathVariable int idProduct) {
        return feedbackService.getSentimentById( idProduct);
    }

    @PostMapping("user/feedback/add/{idUser}/{idProduct}")
    public String addProduct(@PathVariable int idProduct, @PathVariable int idUser, @RequestBody Feedback feedback) {
        return feedbackService.addFeedback(idUser, idProduct, feedback);
    }

    @PutMapping("user/feedback/update")
    public Feedback updateProduct(@RequestBody Feedback feedback) {
        return feedbackService.updateFeedback(feedback);
    }

    @DeleteMapping("user/feedback/delete/{id}")
    public void deleteProduct(@PathVariable int id) {
        feedbackService.deleteById(id);
    }

    @GetMapping("partner/feedback/sentiment/{idProduct}")
    public String getSentiment(@PathVariable int idProduct) {
        return feedbackService.getSentiment(idProduct);
    }
}
