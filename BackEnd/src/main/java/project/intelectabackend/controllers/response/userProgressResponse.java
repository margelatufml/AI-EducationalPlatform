package project.intelectabackend.controllers.response;

import lombok.Data;

import java.util.UUID;

@Data
public class userProgressResponse {
    private UUID id;
    private userResponse user;
    private exercisesResponse exercises;
    private chapterResponse chapter;
}
