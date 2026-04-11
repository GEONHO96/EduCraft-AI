package com.educraftai.domain.user.service;

import com.educraftai.domain.user.dto.AuthResponse;
import com.educraftai.domain.user.dto.SocialAuthRequest;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import com.educraftai.global.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SocialAuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    public AuthResponse.Token socialLogin(SocialAuthRequest request) {
        SocialUserInfo socialUser = switch (request.getProvider()) {
            case GOOGLE -> getGoogleUserInfo(request.getAccessToken());
            case KAKAO -> getKakaoUserInfo(request.getAccessToken());
            default -> throw new BusinessException(ErrorCode.INVALID_INPUT);
        };

        Optional<User> existingUser = userRepository.findBySocialProviderAndSocialId(
                request.getProvider(), socialUser.socialId());

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setName(socialUser.name());
            user.setProfileImage(socialUser.profileImage());
        } else {
            Optional<User> emailUser = userRepository.findByEmail(socialUser.email());
            if (emailUser.isPresent()) {
                user = emailUser.get();
                user.setSocialProvider(request.getProvider());
                user.setSocialId(socialUser.socialId());
                user.setProfileImage(socialUser.profileImage());
            } else {
                user = User.builder()
                        .email(socialUser.email())
                        .name(socialUser.name())
                        .role(request.getRole() != null ? request.getRole() : User.Role.STUDENT)
                        .socialProvider(request.getProvider())
                        .socialId(socialUser.socialId())
                        .profileImage(socialUser.profileImage())
                        .build();
                userRepository.save(user);
            }
        }

        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.Token.builder()
                .accessToken(token)
                .user(AuthResponse.UserInfo.from(user))
                .build();
    }

    private SocialUserInfo getGoogleUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    HttpMethod.GET, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            return new SocialUserInfo(
                    root.path("id").asText(),
                    root.path("email").asText(),
                    root.path("name").asText(),
                    root.path("picture").asText(null)
            );
        } catch (Exception e) {
            log.error("Google 사용자 정보 조회 실패", e);
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    private SocialUserInfo getKakaoUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://kapi.kakao.com/v2/user/me",
                    HttpMethod.GET, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            String socialId = root.path("id").asText();
            JsonNode account = root.path("kakao_account");
            JsonNode profile = account.path("profile");

            String email = account.path("email").asText(socialId + "@kakao.com");
            String name = profile.path("nickname").asText("카카오 사용자");
            String profileImage = profile.path("profile_image_url").asText(null);

            return new SocialUserInfo(socialId, email, name, profileImage);
        } catch (Exception e) {
            log.error("Kakao 사용자 정보 조회 실패", e);
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    private record SocialUserInfo(String socialId, String email, String name, String profileImage) {}
}
