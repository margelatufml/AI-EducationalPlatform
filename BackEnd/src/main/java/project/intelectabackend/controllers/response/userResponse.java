package project.intelectabackend.controllers.response;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import project.intelectabackend.domain.classUser;

import java.util.UUID;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class userResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String password; //se scoate asta mai tarziu
    private String role;
    private UUID parent1;
    private UUID parent2;
    private UUID student;
    private classUser classUser;
    private int points;
    private int lives;
    private byte[] picture;
    private String Process;

    public void excludeFieldsBasedOnRole() {
        if ("USER".equals(role)) {
            student = null;
        } else if ("PARENT".equals(role)) {
            parent1 = null;
            parent2 = null;
            classUser = null;
            points = 0;
            lives = 0;
        } else if ("ADMIN".equals(role)) {
            parent1 = null;
            parent2 = null;
            student = null;
            classUser = null;
            points = 0;
            lives = 0;
        }
    }
}
