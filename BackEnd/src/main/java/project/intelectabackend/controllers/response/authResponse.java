package project.intelectabackend.controllers.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class authResponse {
    private String accessToken;
    private String refreshToken;
}
