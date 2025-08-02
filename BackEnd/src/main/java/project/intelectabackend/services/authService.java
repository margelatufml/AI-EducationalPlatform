package project.intelectabackend.services;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.intelectabackend.configuration.security.token.impl.AccessTokenEncoderDecoderImpl;
import project.intelectabackend.configuration.security.token.impl.AccessTokenImpl;
import project.intelectabackend.controllers.request.authRequest;
import project.intelectabackend.controllers.request.userRequest;
import project.intelectabackend.controllers.response.authResponse;
import project.intelectabackend.controllers.response.userResponse;
import project.intelectabackend.repositories.entity.RefreshToken;
import project.intelectabackend.mappers.userMapper;
import project.intelectabackend.repositories.chaptersRepository;
import project.intelectabackend.repositories.classUserRepository;
import project.intelectabackend.repositories.entity.chaptersEntity;
import project.intelectabackend.repositories.entity.classUserEntity;
import project.intelectabackend.repositories.entity.userEntity;
import project.intelectabackend.repositories.userRepository;
import project.intelectabackend.services.exception.ArgumentLengthException;
import project.intelectabackend.services.exception.EmailNotFound;
import project.intelectabackend.services.exception.InvalidCredentialsException;
import project.intelectabackend.services.exception.InvalidUserException;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@AllArgsConstructor
public class authService {
    private final userRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccessTokenEncoderDecoderImpl accessTokenEncoder;
    private final userMapper userMapper;
    private final chaptersRepository chaptersRepository;
    private final classUserRepository classUserRepository;
    private final RefreshTokenService refreshTokenService;
    private final exercisesService exercisesService;
    public authResponse login(authRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            userEntity user = userRepository.findByEmail(request.getEmail());
            if (user == null) {
                throw new EmailNotFound();
            }
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {

                refreshTokenService.deleteRefreshTokensForUser(user.getId());

                exercisesService.getRemainingTime(user.getId());

                String accessToken = generateAccessToken(user);
                RefreshToken refreshToken = generateRefreshToken(user);

                if(Objects.equals(user.getRole(), "USER")){
                    userRequest request1 = new userRequest();
                    request1.setEmail(request.getEmail());
                    addUserToChapter(request1);
                }

                return authResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken.getToken())
                        .build();
            }
            else {
                throw new InvalidCredentialsException();
            }
        } else {
            throw new InvalidCredentialsException();
        }
    }


    public userResponse registerUser(userRequest request, boolean isAdmin) {
        try {

            if (request.getEmail().isBlank() || request.getPassword().isBlank()) {
                throw new ArgumentLengthException("ALL_FIELDS_ARE_REQUIRED");
            }
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new InvalidUserException("EMAIL_ALREADY_EXISTS");
            }
            if (request.getEmail().length() > 35) {
                throw new ArgumentLengthException("USERNAME_TOO_LONG");
            }
            if (request.getEmail().length() < 2) {
                throw new ArgumentLengthException("USERNAME_TOO_SHORT");
            }
            if (request.getPassword().length() > 200) {
                throw new ArgumentLengthException("Password is too long");
            }
            if (request.getPassword().length() < 6) {
                throw new ArgumentLengthException("Password is too short");
            }

            String encodedPassword = passwordEncoder.encode(request.getPassword());
            classUserEntity classUser = classUserRepository.findByClassNumberAndProfil(request.getNumber(), request.getProfil());

            userEntity user = userEntity.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .password(encodedPassword)
                    .classUser(classUser)
                    .lives(10)
                    .process(request.getProcess())
                    .build();

            if (isAdmin)
                user.setRole("ADMIN");
            else
                user.setRole("USER");


            return userMapper.fromEntity(userRepository.save(user));
        }catch (Exception e){
            return null;
        }
    }

    public authResponse register(userRequest request) {
        registerUser(request, false);

        if(addUserToChapter(request)) {
            authRequest loginRequest = authRequest.builder()
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .build();

            return login(loginRequest);
        }
        return null;
    }

    public boolean addUserToChapter(userRequest request){
        userEntity user = userRepository.findByEmail(request.getEmail());
        chaptersRepository.addUserToChapters(user.getClassUser().getId(), user.getId());
        return true;
    }


    public userResponse registerAdmin(userRequest request) {
        return registerUser(request, true);
    }

    public String generateAccessToken(userEntity user) {
        Set<String> roles = new HashSet<>();
        roles.add(user.getRole());


        return accessTokenEncoder.encode(
                AccessTokenImpl.builder()
                        .subject(user.getEmail())
                        .roles(roles)
                        .userId(user.getId())
                        .build());
    }

    public RefreshToken generateRefreshToken(userEntity user) {
        return refreshTokenService.createRefreshToken(user.getId());
    }
}
