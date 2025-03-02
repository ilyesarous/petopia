package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.store.SecondHand;
import tn.esprit.petopia_backend.services.store.SecondHandService;

import java.util.List;

@RestController
@RequestMapping("second_hand")
@AllArgsConstructor
public class SecondHandController {
    private SecondHandService secondHandService;
    @GetMapping
    public List<SecondHand> findAll() {
        return secondHandService.findAll();
    }
    @GetMapping("{id}")
    public SecondHand findById(@PathVariable int id) {
        return secondHandService.findById(id);
    }
    @PostMapping("add")
    public SecondHand addSecondHand(@RequestBody SecondHand secondHand) {
        return secondHandService.addSecondHand(secondHand);
    }
    @PutMapping("update")
    public SecondHand updateSecondHand(@RequestBody SecondHand secondHand) {
        return secondHandService.updateSecondHand(secondHand);
    }
    @DeleteMapping("delete/{id}")
    public void deleteSecondHand(@PathVariable int id) {
        secondHandService.deleteById(id);
    }
}
