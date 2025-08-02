//package project.intelectabackend.controllers;
//
//import jakarta.annotation.security.RolesAllowed;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import project.intelectabackend.configuration.security.token.AccessToken;
//import project.intelectabackend.configuration.security.token.impl.AccessTokenEncoderDecoderImpl;
//import project.intelectabackend.controllers.request.testRequestWrapper;
//import project.intelectabackend.controllers.response.testResponse;
//import project.intelectabackend.services.testService;
//
//import java.util.UUID;
//
//@RestController
//@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
//@RequestMapping("/test")
//public class testController {
//    private final AccessTokenEncoderDecoderImpl accessTokenEncoderDecoder;
//    private final testService testService;
//
//    @RolesAllowed({"USER"})
//    @GetMapping("/generateTest/{id}")
//    public ResponseEntity<testResponse> generateTest(@PathVariable("id") UUID subjectId, @RequestHeader("Authorization") String token, @RequestBody boolean premium) {
//        try {
//            String accessToken = token.replace("Bearer ", "");
//            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
//            String role = decodedToken.getRoles().toString();
//            UUID userId = decodedToken.getUserId();
//            if (role.contains("USER")) {
//                return ResponseEntity.ok( testService.generateTest(userId,subjectId, premium));
//            } else {
//                return ResponseEntity.status(403).build();
//            }
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//
////        URL:localhost:8080/test/generateTest
////        Authorization: Bearer Token
////         JSON Send:
////        {
////            "premium": false
////        }
//    }
//
//
//    @RolesAllowed({"USER"})
//    @PostMapping("/correctionTest/{id}")
//    public ResponseEntity<testResponse> correctionTest(@PathVariable("id") UUID testId, @RequestHeader("Authorization") String token, @RequestBody testRequestWrapper testRequestWrapper) {
//        try {
//            String accessToken = token.replace("Bearer ", "");
//            AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessToken);
//            String role = decodedToken.getRoles().toString();
//            UUID userId = decodedToken.getUserId();
//            if (role.contains("USER")) {
//                String testRequest = testRequestWrapper.getAnswer();
//                boolean premium = testRequestWrapper.isPremium();
//                return ResponseEntity.ok( testService.correctionTest(testId,userId,testRequest, premium));
//            } else {
//                return ResponseEntity.status(403).build();
//            }
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//
////        URL:localhost:8080/test/correctionTest/8456320465120651
////        Authorization: Bearer Token
////         JSON Send:
////        {
////            "premium": false
////            "answer": "1. 2 ; 2. 4 ; 3. 5"
////        }
//    }
//
//
//}
