package project.intelectabackend.controllers.request;

import lombok.Data;

import java.util.UUID;

@Data
public class userProgressRequest {
    private UUID exerciseId;
    private UUID userId;
    private String answer;
    private boolean premium;
    private String mesajPrecedent;
    private String raspunsAnterior;
}
