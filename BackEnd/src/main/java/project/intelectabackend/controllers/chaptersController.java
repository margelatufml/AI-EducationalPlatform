package project.intelectabackend.controllers;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.intelectabackend.configuration.security.token.AccessToken;
import project.intelectabackend.configuration.security.token.impl.AccessTokenEncoderDecoderImpl;
import project.intelectabackend.controllers.request.chapterRequest;
import project.intelectabackend.controllers.response.chapterResponse;
import project.intelectabackend.services.chaptersService;

import java.math.BigDecimal;
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
@RequestMapping("/chapters")
public class chaptersController {
    private final chaptersService chaptersService;
    private final AccessTokenEncoderDecoderImpl accessTokenEncoderDecoder;

    @RolesAllowed({"ADMIN"})
    @PostMapping("/addChapter")
    public ResponseEntity<chapterResponse> addChapter(@RequestBody chapterRequest chapterRequest, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(chaptersService.createChapter(chapterRequest));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
//        URL:localhost:8080/chapters/addChapter
//        Authorization: Bearer Token
//         JSON Send:
//        {
//            "name": "function",
//            "subjectId": "4865132086513032046513",
//            "classId": "486513265132645132651325"
//        }
    }

    @RolesAllowed({"ADMIN"})
    @PutMapping("/updateChapter/{id}")
    public ResponseEntity<chapterResponse> updateChapter(@PathVariable("id") UUID id,@RequestBody chapterRequest chapterRequest, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(chaptersService.updateChapter(id,chapterRequest));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
//        URL:localhost:8080/chapters/updateChapter/c6a0d1f5-4d06-4e24-9bb8-ebd96c8a6b94
//        Authorization: Bearer Token
//         JSON Send:
//        {
//            "name": "function",
//            "subjectId": "4865132086513032046513",
//            "classId": "486513265132645132651325"
//        }
    }

    @RolesAllowed({"ADMIN"})
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteChapter(@PathVariable("id") UUID id, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(chaptersService.deleteChapter(id));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"ADMIN", "USER"})
    @GetMapping()
    public ResponseEntity<List<chapterResponse>> getAll() {
        List<chapterResponse> chapters = chaptersService.getAllChapters();
        return ResponseEntity.ok(chapters);
    }


    @RolesAllowed({"ADMIN", "USER"})
    @GetMapping("{id}")
    public ResponseEntity<chapterResponse> getUserById(@PathVariable("id") UUID id, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID userId = decodedToken.getUserId();
            if ((role.contains("USER") || role.contains("ADMIN")) && (userId.equals(id) || role.contains("ADMIN"))) {
                chapterResponse chapter = chaptersService.getChapterById(id);
                return ResponseEntity.ok(chapter);
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

//        URL:localhost:8080/chapters/c6a0d1f5-4d06-4e24-9bb8-ebd96c8a6b94
//        Authorization: Bearer Token
    }

    @RolesAllowed({"ADMIN", "USER"})
    @GetMapping("/chaptersFinishByUser/{id}")
    public ResponseEntity<List<chapterResponse>> getChaptersFinishByUserId(@PathVariable("id") UUID id,@RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID userId = decodedToken.getUserId();
            if (role.contains("USER") || role.contains("ADMIN")) {
                return ResponseEntity.ok(chaptersService.getChaptersFinishByUserId(userId,id));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"ADMIN", "USER"})
    @GetMapping("/chaptersStaredByUser/{id}")
    public ResponseEntity<List<chapterResponse>> getChaptersStartedByUserId(@PathVariable("id") UUID id,@RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID userId = decodedToken.getUserId();
            if (role.contains("USER") || role.contains("ADMIN")) {
                return ResponseEntity.ok(chaptersService.getChaptersStartedByUserId(userId,id));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"ADMIN", "USER", "PARENT"})
    @GetMapping("/calculateCompletedPercentage/{subjectId}")
    public ResponseEntity<BigDecimal> calculateCompletedPercentage(@PathVariable("subjectId") UUID subjectId,@RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID userId = decodedToken.getUserId();
            if (role.contains("USER") || role.contains("ADMIN") || role.contains("PARENT")) {
                return ResponseEntity.ok(chaptersService.calculateCompletedPercentage(userId,subjectId));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"ADMIN", "USER", "PARENT"})
    @GetMapping("/calculateRemainingPercentage/{subjectId}")
    public ResponseEntity<BigDecimal> calculateRemainingPercentage(@PathVariable("subjectId") UUID subjectId,@RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID userId = decodedToken.getUserId();
            if (role.contains("USER") || role.contains("ADMIN") || role.contains("PARENT")) {
                return ResponseEntity.ok(chaptersService.calculateRemainingPercentage(userId,subjectId));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
