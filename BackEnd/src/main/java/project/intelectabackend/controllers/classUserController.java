package project.intelectabackend.controllers;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.intelectabackend.configuration.security.token.AccessToken;
import project.intelectabackend.configuration.security.token.impl.AccessTokenEncoderDecoderImpl;
import project.intelectabackend.controllers.request.addClassUser;
import project.intelectabackend.domain.classUser;
import project.intelectabackend.services.classUserService;

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
@RequestMapping("/class")
public class classUserController {
    private final classUserService classUserService;
    private final AccessTokenEncoderDecoderImpl accessTokenEncoderDecoder;



    @RolesAllowed({"ADMIN"})
    @PostMapping("/addClass")
    public ResponseEntity<Boolean> addClassForUser(@RequestBody addClassUser addClassUser, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(classUserService.addClass(addClassUser));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"ADMIN"})
    @PutMapping("/updateClass/{id}")
    public ResponseEntity<Boolean> updateClassForUser(@PathVariable("id") UUID id,@RequestBody addClassUser addClassUser, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            if (role.contains("ADMIN")) {
                return ResponseEntity.ok(classUserService.updateClass(id, addClassUser));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"ADMIN"})
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteClassUser(@PathVariable("id") UUID id, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String userRole = decodedToken.getRoles().toString();
            if (!userRole.contains("ADMIN"))
                return ResponseEntity.status(403).build();
            else {
                classUserService.deleteClass(id);
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping()
    public ResponseEntity<List<classUser>> getAll() {
        List<classUser> users = classUserService.getAll();
        return ResponseEntity.ok(users);
    }
}
