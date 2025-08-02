package project.intelectabackend.domain;

import lombok.Data;

import java.util.UUID;
@Data
public class chapters {
    private UUID id;
    private String name;
    private subject subject;
    private classUser classUser;
}
