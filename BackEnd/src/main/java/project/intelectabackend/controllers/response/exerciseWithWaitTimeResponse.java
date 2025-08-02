package project.intelectabackend.controllers.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class exerciseWithWaitTimeResponse {
    private exercisesResponse exercise;
    private String waitTime;
}
