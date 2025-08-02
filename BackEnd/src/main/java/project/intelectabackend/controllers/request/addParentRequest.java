package project.intelectabackend.controllers.request;

import lombok.Data;

@Data
public class addParentRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}
