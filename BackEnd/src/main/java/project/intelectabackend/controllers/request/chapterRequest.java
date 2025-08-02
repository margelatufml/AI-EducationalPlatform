package project.intelectabackend.controllers.request;

import lombok.Data;
import project.intelectabackend.domain.classUser;

import java.util.UUID;

@Data
public class chapterRequest {

    private String name;
    private UUID subjectId;
    private UUID classId;
}
