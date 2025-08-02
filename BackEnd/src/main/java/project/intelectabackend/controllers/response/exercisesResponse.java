package project.intelectabackend.controllers.response;

import lombok.Data;

import java.util.List;
import java.util.UUID;
@Data
public class exercisesResponse {
    private UUID id;
    private String content;
    private String answer;
    private int points;
    private String type;
    private chapterResponse chapter;
    private List<String> steps;
}
