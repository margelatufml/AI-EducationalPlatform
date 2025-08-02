package project.intelectabackend.domain;

import lombok.Data;

import java.util.UUID;

@Data
public class userProgress {
    private UUID id;
    private user user;
    private chapters chapters;
    private exercises exercises;
}
