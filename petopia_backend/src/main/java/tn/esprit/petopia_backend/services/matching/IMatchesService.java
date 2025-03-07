package tn.esprit.petopia_backend.services.matching;


import tn.esprit.petopia_backend.entities.matching.Matches;

import java.util.List;

public interface IMatchesService {
    Matches addMatches(Matches matches);
    Matches updateMatches(Matches matches);
    Matches getMatches(int id);
    List<Matches> getAllMatches();
    void deleteMatches(int id);
}
