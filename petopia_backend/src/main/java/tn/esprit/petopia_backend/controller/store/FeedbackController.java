package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.store.Feedback;
import tn.esprit.petopia_backend.services.store.FeedbackService;

import java.util.List;

@RestController
@RequestMapping("feedback")
@AllArgsConstructor
public class FeedbackController {
    private FeedbackService feedbackService;
    @GetMapping
    public List<Feedback> findAll() {
        return feedbackService.findAll();
    }
    @GetMapping("{id}")
    public Feedback findById(@PathVariable int id) {
        return feedbackService.findById(id);
    }
    @PostMapping("add")
    public Feedback addProduct(@RequestBody Feedback feedback) {
        return feedbackService.addFeedback(feedback);
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
