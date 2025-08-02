package project.intelectabackend.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

public class UserNotFound extends ResponseStatusException {
    public UserNotFound(UUID id) {
        super(HttpStatus.BAD_REQUEST, "User with id " + id + " not found!" );
    }
}
