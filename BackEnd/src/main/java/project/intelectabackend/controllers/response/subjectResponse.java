package project.intelectabackend.controllers.response;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class subjectResponse {
    private UUID id;
    private String name;
    private List<chapterResponse> chapters;
}
