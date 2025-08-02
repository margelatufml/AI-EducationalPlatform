package project.intelectabackend.controllers.request;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class exercisesRequest {
    private String content;
    private String answer;
    private String type;
    private UUID chapterId;
    private List<String> steps;
}
