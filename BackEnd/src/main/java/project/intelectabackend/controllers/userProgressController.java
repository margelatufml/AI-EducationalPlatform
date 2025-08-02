package project.intelectabackend.controllers;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.intelectabackend.configuration.security.token.AccessToken;
import project.intelectabackend.configuration.security.token.impl.AccessTokenEncoderDecoderImpl;
import project.intelectabackend.controllers.request.ChapterCountRequest;
import project.intelectabackend.controllers.request.gptForExercises;
import project.intelectabackend.controllers.request.userProgressRequest;
import project.intelectabackend.controllers.response.CountResponse;
import project.intelectabackend.controllers.response.exercisesResponse;
import project.intelectabackend.controllers.response.userProgressResponse;
import project.intelectabackend.repositories.entity.exercisesEntity;
import project.intelectabackend.services.userProgressService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"https://d36rrxa3i1lozq.cloudfront.net",
        "https://www.intelecta.ro",
        "https://intelecta.ro",
        "http://intelectafacutlateshow.s3-website-us-east-1.amazonaws.com",
        "https://api.intelecta.ro"
}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequestMapping("/userProgress")
public class userProgressController {
    private final userProgressService userProgressService;
    private final AccessTokenEncoderDecoderImpl accessTokenEncoderDecoder;

    @RolesAllowed({"USER"})
    @PostMapping("/correctExercices")
    public ResponseEntity<String> correctExercices(@RequestBody userProgressRequest userProgressRequest, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("USER")) {
                return userProgressService.correctExercices(userProgressRequest);
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"USER"})
    @PostMapping("/mesajMaiUsor")
    public ResponseEntity<String> mesajMaiUser(@RequestBody userProgressRequest userProgressRequest, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("USER")) {
                return userProgressService.mesajMaiUser(userProgressRequest);
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"USER"})
    @GetMapping("/getTrackForUser")
    public ResponseEntity<List<userProgressResponse>> getTrackForUser( @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID id = decodedToken.getUserId();
            if (role.contains("USER")) {
                return ResponseEntity.ok(userProgressService.getTrackForUser(id));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"USER"})
    @PostMapping("/getCountForUser")
    public ResponseEntity<CountResponse> getCountForUser(@RequestParam UUID chapterId, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID id = decodedToken.getUserId();
            if (role.contains("USER")) {
                return ResponseEntity.ok(userProgressService.getUserCompletedExercisesCountByChapter(id,chapterId));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"USER","ADMIN"})
    @GetMapping("/top3Scores")
    public ResponseEntity<List<Object[]>> top3Scores(@RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("USER") || role.contains("ADMIN")) {
                return ResponseEntity.ok(userProgressService.top3Scores());
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"ADMIN"})
    @PostMapping("/createExercisesFromGPT")
    public ResponseEntity<String> createExercisesFromGPT(@RequestBody gptForExercises gpt, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(userProgressService.createExercisesFromGPT(gpt));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


}
