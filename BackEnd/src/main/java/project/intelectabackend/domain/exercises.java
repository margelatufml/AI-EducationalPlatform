package project.intelectabackend.domain;

import lombok.Data;

import java.util.UUID;

@Data
public class exercises {
    private UUID id;
    private String content;
    private String answer;
    private int points;
    private chapters chapter;
    private String type;
}
