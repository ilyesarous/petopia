package tn.esprit.petopia_backend.services.matching;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.matching.MatchStatus;
import tn.esprit.petopia_backend.entities.matching.Matches;
import tn.esprit.petopia_backend.repositories.matching.MatchesRepository;

import java.util.List;

@Service
public class MatchesService  implements IMatchesService{
    @Autowired
    private MatchesRepository matchesRepository;
    @Override
    public Matches addMatches(Matches matches) {
        return matchesRepository.save(matches);
    }

    @Override
    public Matches updateMatches(Matches matches) {
        return matchesRepository.save(matches);
    }

    @Override
    public Matches getMatches(int id) {
        return matchesRepository.findById(id).get();
    }

    @Override
    public List<Matches> getAllMatches() {
        return matchesRepository.findAll();
    }

    @Override
    public void deleteMatches(int id) {
        matchesRepository.deleteById(id);

    }
    @Override
    public List<Matches> getMatchesByPet2IdAndPending(int pet2Id) {
        return matchesRepository.findByPet2IdAndStatus(pet2Id, MatchStatus.PENDING);
    }
}
