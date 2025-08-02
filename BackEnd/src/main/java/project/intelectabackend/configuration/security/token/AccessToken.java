package project.intelectabackend.configuration.security.token;

import java.util.Set;
import java.util.UUID;

public interface AccessToken {
    String getSubject();

    UUID getUserId();

    Set<String> getRoles();

    boolean hasRole(String roleName);
}
