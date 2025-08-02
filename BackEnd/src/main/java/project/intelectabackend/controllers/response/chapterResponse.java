package project.intelectabackend.controllers.response;

import lombok.Data;
import project.intelectabackend.domain.classUser;
import project.intelectabackend.domain.subject;

import java.util.UUID;

@Data
public class chapterResponse {
    private UUID id;
    private String name;
    private classUser classUser;
}
