package project.intelectabackend.controllers;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.intelectabackend.configuration.security.token.AccessToken;
import project.intelectabackend.configuration.security.token.impl.AccessTokenEncoderDecoderImpl;
import project.intelectabackend.controllers.request.exercisesRequest;
import project.intelectabackend.controllers.response.chapterResponse;
import project.intelectabackend.controllers.response.exerciseWithWaitTimeResponse;
import project.intelectabackend.controllers.response.exercisesResponse;
import project.intelectabackend.services.exercisesService;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"https://d36rrxa3i1lozq.cloudfront.net",
        "https://www.intelecta.ro",
        "https://intelecta.ro",
        "http://intelectafacutlateshow.s3-website-us-east-1.amazonaws.com",
        "https://api.intelecta.ro"
}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequestMapping("/exercices")
public class exercisesController {
    private final exercisesService exercisesService;
    private final AccessTokenEncoderDecoderImpl accessTokenEncoderDecoder;

    @RolesAllowed({"ADMIN"})
    @PostMapping("/addExercices")
    public ResponseEntity<exercisesResponse> addExercices(@RequestBody exercisesRequest exercisesRequest, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(exercisesService.createExercises(exercisesRequest));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"ADMIN"})
    @PutMapping("/updateExercices/{id}")
    public ResponseEntity<exercisesResponse> updateExercices(@RequestBody exercisesRequest exercisesRequest, @PathVariable UUID id, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(exercisesService.updateExercises(id,exercisesRequest));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"ADMIN"})
    @DeleteMapping("/deleteExercices/{id}")
    public ResponseEntity<Boolean> deleteExercices(@PathVariable UUID id, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(exercisesService.deleteExercises(id));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"ADMIN"})
    @GetMapping()
    public ResponseEntity<List<exercisesResponse>> getAll() {
        List<exercisesResponse> exercises = exercisesService.getAllExercices();
        return ResponseEntity.ok(exercises);
    }

    @RolesAllowed({"ADMIN"})
    @GetMapping("/{id}")
    public ResponseEntity<exercisesResponse> getExercicesById(@PathVariable UUID id, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(exercisesService.getExercisesById(id));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"USER"})
    @GetMapping("/getExercices/{chapterId}")
        public ResponseEntity<exerciseWithWaitTimeResponse> getExercices(@PathVariable UUID chapterId, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID id  = decodedToken.getUserId();
            if (role.contains("USER")) {
                exerciseWithWaitTimeResponse exercises = exercisesService.getExercises(id, chapterId);
                if(exercises == null)
                    return ResponseEntity.ok().build();
                return ResponseEntity.ok(exercises);
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @RolesAllowed({"USER"})
    @GetMapping("/getRemainingTime")
    public ResponseEntity<String> getRemainingTime(@RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID id  = decodedToken.getUserId();
            if (role.contains("USER")) {
                String time = exercisesService.getRemainingTime(id);
                if(time == null)
                    return ResponseEntity.ok().build();
                return ResponseEntity.ok(time);
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


}
