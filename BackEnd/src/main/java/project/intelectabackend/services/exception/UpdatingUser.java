package project.intelectabackend.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class UpdatingUser extends ResponseStatusException {
    public UpdatingUser() {
        super(HttpStatus.BAD_REQUEST, "Error updating user:");
    }
}
