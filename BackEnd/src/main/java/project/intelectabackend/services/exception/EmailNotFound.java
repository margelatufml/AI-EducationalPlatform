package project.intelectabackend.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class EmailNotFound extends ResponseStatusException {
    public EmailNotFound() {
        super(HttpStatus.BAD_REQUEST, "EMAIL_NOT_FOUND");
    }
}
