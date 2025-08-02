package project.intelectabackend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.intelectabackend.repositories.entity.RefreshToken;
import project.intelectabackend.repositories.RefreshTokenRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
@Service
public class RefreshTokenService {
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    public RefreshToken createRefreshToken(UUID userId) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUserId(userId);
        refreshToken.setExpiryDate(Instant.now().plus(30, ChronoUnit.DAYS));
        return refreshTokenRepository.save(refreshToken);
    }

    public void deleteRefreshTokensForUser(UUID userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    public RefreshToken findRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }
}
