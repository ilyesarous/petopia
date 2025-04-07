package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.store.Feedback;
import tn.esprit.petopia_backend.services.store.FeedbackService;

import java.util.List;

@RestController
@RequestMapping("user/feedback")
@AllArgsConstructor
public class FeedbackController {
    private FeedbackService feedbackService;

    @GetMapping("{id}")
    public Feedback findById(@PathVariable int id) {
        return feedbackService.findById(id);
    }

    @GetMapping("getByProduct/{id}")
    public List<Feedback> findByProduct(@PathVariable int id) {
        return feedbackService.findAllByProduct(id);
    }

    @GetMapping("get/{idProduct}")
    public List<String> findSentimentsByProduct(@PathVariable int idProduct) {
        return feedbackService.getSentimentById( idProduct);
    }

    @PostMapping("add/{idUser}/{idProduct}")
    public String addProduct(@PathVariable int idProduct, @PathVariable int idUser, @RequestBody Feedback feedback) {
        return feedbackService.addFeedback(idUser, idProduct, feedback);
    }

    @PutMapping("update")
    public Feedback updateProduct(@RequestBody Feedback feedback) {
        return feedbackService.updateFeedback(feedback);
    }

    @DeleteMapping("delete/{id}")
    public void deleteProduct(@PathVariable int id) {
        feedbackService.deleteById(id);
    }
}
