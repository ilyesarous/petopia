package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.SecondHand;
import tn.esprit.petopia_backend.repositories.store.SecondHandRepository;
import tn.esprit.petopia_backend.services.store.interfaces.ISecondHandService;

import java.util.List;

@Service
@AllArgsConstructor
public class SecondHandService implements ISecondHandService {
    private SecondHandRepository repository;

    @Override
    public SecondHand addSecondHand(SecondHand secondHand) {
        return repository.save(secondHand);
    }

    @Override
    public SecondHand findById(int id) {
        return repository.findById(id).get();
    }

    @Override
    public void deleteById(int id) {
        repository.deleteById(id);
    }

    @Override
    public SecondHand updateSecondHand(SecondHand secondHand) {
        return repository.save(secondHand);
    }

    @Override
    public List<SecondHand> findAll() {
        return repository.findAll();
    }
}
