package project.intelectabackend.controllers;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.intelectabackend.configuration.security.token.AccessToken;
import project.intelectabackend.configuration.security.token.impl.AccessTokenEncoderDecoderImpl;
import project.intelectabackend.controllers.request.subjectRequest;
import project.intelectabackend.controllers.response.subjectResponse;
import project.intelectabackend.services.subjectService;

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
@RequestMapping("/subject")
public class subjectController {
    private final subjectService subjectService;
    private final AccessTokenEncoderDecoderImpl accessTokenEncoderDecoder;

    @RolesAllowed({"ADMIN"})
    @PostMapping("/addSubject")
    public ResponseEntity<subjectResponse> addSubject(@RequestBody subjectRequest subjectRequest, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(subjectService.createSubject(subjectRequest));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

//        URL:localhost:8080/subject/addSubject
//        Authorization: Bearer Token
//         JSON Send:
//        {
//            "name": "mate"
//        }
    }

    @RolesAllowed({"ADMIN"})
    @PutMapping("/updateChapter/{id}")
    public ResponseEntity<subjectResponse> updateSubject(@PathVariable("id") UUID id, @RequestBody subjectRequest subjectRequest, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(subjectService.updateSubject(id,subjectRequest));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

//        URL:localhost:8080/subject/updateChapter/784561208946513248846
//        Authorization: Bearer Token
//         JSON Send:
//        {
//            "name": "mate"
//        }
    }

    @RolesAllowed({"ADMIN"})
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteSubject(@PathVariable("id") UUID id, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(subjectService.deleteSubject(id));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"ADMIN", "USER"})
    @GetMapping()
    public ResponseEntity<List<subjectResponse>> getAll() {
        List<subjectResponse> chapters = subjectService.getAll();
        return ResponseEntity.ok(chapters);
    }


    @RolesAllowed({"ADMIN", "USER"})
    @GetMapping("{id}")
    public ResponseEntity<subjectResponse> getUserById(@PathVariable("id") UUID id, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID userId = decodedToken.getUserId();
            if ((role.contains("USER") || role.contains("ADMIN")) && (userId.equals(id) || role.contains("ADMIN"))) {
                subjectResponse subject = subjectService.getSubjectById(id);
                return ResponseEntity.ok(subject);
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
//        URL:localhost:8080/subject/784561208946513248846
//        Authorization: Bearer Token
    }
}
