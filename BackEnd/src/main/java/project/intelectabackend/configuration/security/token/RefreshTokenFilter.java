package project.intelectabackend.configuration.security.token;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import project.intelectabackend.configuration.security.token.impl.AccessTokenEncoderDecoderImpl;
import project.intelectabackend.repositories.entity.RefreshToken;
import project.intelectabackend.repositories.entity.userEntity;
import project.intelectabackend.repositories.userRepository;
import project.intelectabackend.services.RefreshTokenService;
import project.intelectabackend.services.authService;

import java.io.IOException;
import java.time.Instant;

public class RefreshTokenFilter implements jakarta.servlet.Filter {
    private final RefreshTokenService refreshTokenService;
    private final userRepository userRepository;
    private final authService authService;


    public RefreshTokenFilter(RefreshTokenService refreshTokenService, AccessTokenEncoderDecoderImpl accessTokenEncoderDecoder, project.intelectabackend.repositories.userRepository userRepository, authService authService) {
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
        this.authService = authService;
    }


    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String refreshToken = httpRequest.getHeader("Authorization");
        if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
            refreshToken = refreshToken.substring(7);

            RefreshToken refreshTokenEntity = refreshTokenService.findRefreshToken(refreshToken);
            if (refreshTokenEntity != null && refreshTokenEntity.getExpiryDate().isBefore(Instant.now())) {
                userEntity user = userRepository.findById(refreshTokenEntity.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

                String newAccessToken = authService.generateAccessToken(user);

                httpResponse.setHeader("accessToken", newAccessToken);
            } else {
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        chain.doFilter(request, response);
    }

}
