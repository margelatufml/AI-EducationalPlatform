package project.intelectabackend.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class ArgumentLengthException extends ResponseStatusException {
    public ArgumentLengthException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
