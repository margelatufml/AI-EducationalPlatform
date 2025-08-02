package project.intelectabackend.controllers.request;

import lombok.Data;
import project.intelectabackend.domain.classUser;
@Data
public class userRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
    private byte[] picture;
    private int number;
    private String profil;
    private String process;
}
