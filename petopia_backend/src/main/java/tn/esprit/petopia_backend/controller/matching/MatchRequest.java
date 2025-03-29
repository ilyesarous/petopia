package tn.esprit.petopia_backend.controller.matching;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MatchRequest {
    private int idMatchRequest;
    private int pet1Id;
    private int pet2Id;
}
