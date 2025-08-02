package project.intelectabackend.controllers.request;

import lombok.Data;

import java.util.UUID;

@Data
public class gptForExercises {
    private UUID chapterId;
    private String type;
    private int number;
    private boolean premium;
}
