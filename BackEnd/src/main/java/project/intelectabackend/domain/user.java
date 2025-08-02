package project.intelectabackend.domain;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
@Data
public class user {
    private  UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
    private UUID parent1;
    private UUID parent2;
    private UUID student;
    private List<subject> subjects;
    private classUser classUser;
    private int points;
    private int lives;
    private byte[] picture;
    private Map<UUID, Integer> chapterStrikeCounts = new HashMap<>();
    private Map<UUID, LocalDateTime> lastErrorTimes = new HashMap<>();
}
