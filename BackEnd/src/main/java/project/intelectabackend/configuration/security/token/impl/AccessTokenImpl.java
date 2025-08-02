package project.intelectabackend.configuration.security.token.impl;

import project.intelectabackend.configuration.security.token.AccessToken;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;

@EqualsAndHashCode
@Getter
@Builder
public class AccessTokenImpl implements AccessToken {
    private final String subject;
    private final UUID userId;
    private final Set<String> roles;

    public AccessTokenImpl(String subject, UUID userId, Collection<String> roles) {
        this.subject = subject;
        this.userId = userId;
        this.roles = roles != null ? Set.copyOf(roles) : Collections.emptySet();
    }

    @Override
    public boolean hasRole(String roleName) {
        return this.roles.contains(roleName);
    }
}
