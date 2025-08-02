package project.intelectabackend.controllers;


import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.intelectabackend.configuration.security.token.AccessToken;
import project.intelectabackend.configuration.security.token.impl.AccessTokenEncoderDecoderImpl;
import project.intelectabackend.controllers.request.addClassUser;
import project.intelectabackend.controllers.request.addParentRequest;
import project.intelectabackend.controllers.request.userRequest;
import project.intelectabackend.controllers.response.userResponse;
import project.intelectabackend.services.userService;
import java.util.List;
import java.util.UUID;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"https://d36rrxa3i1lozq.cloudfront.net",
        "https://www.intelecta.ro",
        "https://intelecta.ro",
        "http://intelectafacutlateshow.s3-website-us-east-1.amazonaws.com",
        "https://api.intelecta.ro"
}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequestMapping("/user")
public class userController {
    private final userService userService;
    private final AccessTokenEncoderDecoderImpl accessTokenEncoderDecoder;

    @RolesAllowed({"ADMIN", "USER"})
    @GetMapping()
    public ResponseEntity<List<userResponse>> getAll() {
        List<userResponse> users = userService.getAll();
        users.forEach(userResponse::excludeFieldsBasedOnRole);
        return ResponseEntity.ok(users);
//         URL:localhost:8080/user
//        Authorization: Bearer Token
//         JSON Received:
//        {
//            "id": "c6a0d1f5-4d06-4e24-9bb8-ebd96c8a6b94",
//                "firstName": "John",
//                "lastName": "Doe",
//                "email": "john.doe@example.com",
//                "password": "********",
//                "role": "USER"
//        }
    }

    @RolesAllowed({"ADMIN", "USER", "PARENT"})
    @GetMapping("{id}")
    public ResponseEntity<userResponse> getUserById(@PathVariable("id") UUID id, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID userId = decodedToken.getUserId();
            if ((role.contains("USER") || role.contains("ADMIN")) && (userId.equals(id) || role.contains("ADMIN"))) {
                userResponse user = userService.getUserById(id);
                user.excludeFieldsBasedOnRole();
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
//        URL:localhost:8080/user/c6a0d1f5-4d06-4e24-9bb8-ebd96c8a6b94
//        Authorization: Bearer Token
//         JSON Received:
//        {
//            "id": "c6a0d1f5-4d06-4e24-9bb8-ebd96c8a6b94",
//                "firstName": "John",
//                "lastName": "Doe",
//                "email": "john.doe@example.com",
//                "password": "********",
//                "role": "USER"
//        }
    }

    @RolesAllowed({"ADMIN", "USER"})
    @PutMapping("{id}")
    public ResponseEntity<userResponse> updateUser(@PathVariable("id") UUID id, @RequestBody userRequest userRequest, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID userId = decodedToken.getUserId();
            if ((role.contains("USER") || role.contains("ADMIN")) && (userId.equals(id) || role.contains("ADMIN"))) {
                userResponse updatedUser = userService.updateUser(id, userRequest);
                updatedUser.excludeFieldsBasedOnRole();
                return ResponseEntity.ok(updatedUser);
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
//        URL:localhost:8080/user/c6a0d1f5-4d06-4e24-9bb8-ebd96c8a6b94
//        Authorization: Bearer Token
//         JSON Send:
//        {
//            "id": "c6a0d1f5-4d06-4e24-9bb8-ebd96c8a6b94",
//                "firstName": "John",
//                "lastName": "Doe",
//                "email": "john.doe@example.com",
//                "password": "********",
//                "role": "USER"
//        }
//         JSON Received:
//        {
//            "id": "c6a0d1f5-4d06-4e24-9bb8-ebd96c8a6b94",
//                "firstName": "John",
//                "lastName": "Doe",
//                "email": "john.doe@example.com",
//                "password": "********",
//                "role": "USER"
//        }
    }


    @RolesAllowed({"ADMIN"})
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") UUID id, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String userRole = decodedToken.getRoles().toString();
            if (!userRole.contains("ADMIN"))
                return ResponseEntity.status(403).build();
            else {
                userService.deleteUser(id);
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RolesAllowed({"USER"})
    @PostMapping("/addParent")
    public ResponseEntity<Void> addParent(@RequestBody addParentRequest addParentRequest,@RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            UUID userId = decodedToken.getUserId();
            if (userService.addParent(userId,addParentRequest))
            {
                return ResponseEntity.ok().build();
            }else {
                return ResponseEntity.notFound().build();
            }

        }catch (Exception e)
        {
            return ResponseEntity.internalServerError().build();
        }
//        URL:localhost:8080/user/addParent
//        Authorization: Bearer Token
//         JSON Send:
//        {
//                "firstName": "John",
//                "lastName": "Doe",
//                "email": "john.doe@example.com",
//                "password": "********"
//        }
    }


    @RolesAllowed({"PARENT"})
    @GetMapping("/getUser")
    public ResponseEntity<userResponse> getUserForParent(@RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID userId = decodedToken.getUserId();
            if (role.contains("PARENT"))
            {
                userResponse user = userService.getUserForParent(userId);
                user.excludeFieldsBasedOnRole();
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
//        URL:localhost:8080/user/getUser
//        Authorization: Bearer Token
//         JSON Received:
//        {
//            "id": "c6a0d1f5-4d06-4e24-9bb8-ebd96c8a6b94",
//                "firstName": "John",
//                "lastName": "Doe",
//                "email": "john.doe@example.com",
//                "password": "********",
//                "role": "USER"
//        }

    }

    @RolesAllowed({"USER"})
    @PutMapping("/addClassForUser")
    public ResponseEntity<Boolean> setClassForUser(@RequestBody addClassUser addClassUser, @RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
            String role = decodedToken.getRoles().toString();
            UUID userId = decodedToken.getUserId();
            if (role.contains("USER")) {

                return ResponseEntity.ok(userService.setClassForUser(userId, addClassUser));
            } else {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
        //        URL:localhost:8080/user/addClassForUser
//        Authorization: Bearer Token
//         JSON Send:
//        {
//            "number": 12,
//        }
//         JSON Received:
//        {
//           true
//        }
    }

}
