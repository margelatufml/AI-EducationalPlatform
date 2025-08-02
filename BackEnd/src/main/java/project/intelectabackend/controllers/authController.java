package project.intelectabackend.controllers;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import project.intelectabackend.configuration.security.token.AccessToken;
import project.intelectabackend.configuration.security.token.impl.AccessTokenEncoderDecoderImpl;
import project.intelectabackend.controllers.request.authRequest;
import project.intelectabackend.controllers.request.userRequest;
import project.intelectabackend.controllers.response.authResponse;
import project.intelectabackend.controllers.response.userResponse;
import project.intelectabackend.repositories.entity.RefreshToken;
import project.intelectabackend.repositories.entity.userEntity;
import project.intelectabackend.repositories.userRepository;
import project.intelectabackend.services.RefreshTokenService;
import project.intelectabackend.services.authService;

import java.time.Instant;
import java.util.UUID;

@Controller
@RequestMapping("/welcome")
@RequiredArgsConstructor
public class authController {
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private authService authService;
    private final userRepository userRepository;
    private final AccessTokenEncoderDecoderImpl accessTokenEncoderDecoder;
    @PostMapping("/login")
    public ResponseEntity<authResponse> login(@RequestBody authRequest request) {
        try{

                return ResponseEntity.ok().body(authService.login(request));

        }catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
//        URL:localhost:8080/welcome/login
//         JSON Send:
//        {
//                "email": "john.doe@example.com",
//                "password": "********"
//        }
//         JSON Received:
//        {
//            "AccessToken":"eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJKb25Eb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDY4MDc1MTUsImV4cCI6MTcwNjgwOTMxNSwicm9sZXMiOlsiVVNFUiJdLCJ1c2VySWQiOiI1M2M1MTQ2Yy1hZDM2LTRiODUtYTgxNS1iNTU3YTgzZjNjYzcifQ.kNX5F-qsWNWz7DH05aSCrW6Pkmf3mLYgpXpebbFbE6mIJlfNeEcIj5uo4j3_tYnC"
//        }
    }

    @PostMapping("/register")
    public ResponseEntity<authResponse> register(@RequestBody userRequest request) {
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
        }catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

//        URL:localhost:8080/welcome/register
//         JSON Send:
//        {
//                "firstName": "John",
//                "lastName": "Doe",
//                "email": "john.doe@example.com",
//                "password": "********",
//                "role": "USER"
//        }
//         JSON Received:
//        {
//            "AccessToken":"eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJKb25Eb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDY4MDc1MTUsImV4cCI6MTcwNjgwOTMxNSwicm9sZXMiOlsiVVNFUiJdLCJ1c2VySWQiOiI1M2M1MTQ2Yy1hZDM2LTRiODUtYTgxNS1iNTU3YTgzZjNjYzcifQ.kNX5F-qsWNWz7DH05aSCrW6Pkmf3mLYgpXpebbFbE6mIJlfNeEcIj5uo4j3_tYnC"
//        }
    }
    @RolesAllowed({"ADMIN"})
    @PostMapping("/registerAdmin")
    public ResponseEntity<userResponse> registerAdmin(@RequestBody userRequest request) {
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerAdmin(request));
        }catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
//         URL:localhost:8080/welcome/registerAdmin
//        Authorization: Bearer Token
//         JSON Send:
//        {
//                "firstName": "John",
//                "lastName": "Doe",
//                "email": "john.doe@example.com",
//                "password": "********",
//                "role": "ADMIN"
//        }
//         JSON Received:
//        {
//            "AccessToken":"eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJKb25Eb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDY4MDc1MTUsImV4cCI6MTcwNjgwOTMxNSwicm9sZXMiOlsiVVNFUiJdLCJ1c2VySWQiOiI1M2M1MTQ2Yy1hZDM2LTRiODUtYTgxNS1iNTU3YTgzZjNjYzcifQ.kNX5F-qsWNWz7DH05aSCrW6Pkmf3mLYgpXpebbFbE6mIJlfNeEcIj5uo4j3_tYnC"
//        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<authResponse> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        RefreshToken refreshTokenEntity = refreshTokenService.findRefreshToken(refreshToken);
        if (refreshTokenEntity == null || refreshTokenEntity.getExpiryDate().isBefore(Instant.now())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new authResponse(null, "Invalid or expired refresh token"));
        }

        userEntity user = userRepository.findById(refreshTokenEntity.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        String newAccessToken = authService.generateAccessToken(user);

        return ResponseEntity.ok(new authResponse(newAccessToken, refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String accessToken) {
        String accessTokenn = accessToken.replace("Bearer ", "");
        AccessToken decodedToken = accessTokenEncoderDecoder.decode(accessTokenn);
        UUID userId = decodedToken.getUserId();
        refreshTokenService.deleteRefreshTokensForUser(userId);

        return ResponseEntity.ok("Logout successful");
    }



}
