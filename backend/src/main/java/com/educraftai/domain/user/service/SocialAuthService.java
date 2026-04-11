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
        log.info("[소셜 로그인 요청] provider={}", request.getProvider());

        SocialUserInfo socialUser = switch (request.getProvider()) {
            case GOOGLE -> getGoogleUserInfo(request.getAccessToken());
            case KAKAO -> getKakaoUserInfo(request.getAccessToken());
            case NAVER -> getNaverUserInfo(request.getAccessToken());
            default -> throw new BusinessException(ErrorCode.INVALID_INPUT);
        };

        log.debug("[소셜 사용자 정보] provider={}, socialId={}, email={}, name={}",
                request.getProvider(), socialUser.socialId(), socialUser.email(), socialUser.name());

        Optional<User> existingUser = userRepository.findBySocialProviderAndSocialId(
                request.getProvider(), socialUser.socialId());

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setName(socialUser.name());
            user.setProfileImage(socialUser.profileImage());
            log.info("[소셜 로그인] 기존 사용자 로그인 - userId={}, email={}", user.getId(), user.getEmail());
        } else {
            Optional<User> emailUser = userRepository.findByEmail(socialUser.email());
            if (emailUser.isPresent()) {
                user = emailUser.get();
                user.setSocialProvider(request.getProvider());
                user.setSocialId(socialUser.socialId());
                user.setProfileImage(socialUser.profileImage());
                log.info("[소셜 로그인] 기존 계정에 소셜 연동 - userId={}, provider={}", user.getId(), request.getProvider());
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
                log.info("[소셜 회원가입] 신규 사용자 생성 - userId={}, email={}, provider={}", user.getId(), user.getEmail(), request.getProvider());
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

    private SocialUserInfo getNaverUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://openapi.naver.com/v1/nid/me",
                    HttpMethod.GET, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode responseNode = root.path("response");

            String socialId = responseNode.path("id").asText();
            String email = responseNode.path("email").asText(socialId + "@naver.com");
            String name = responseNode.path("name").asText(responseNode.path("nickname").asText("네이버 사용자"));
            String profileImage = responseNode.path("profile_image").asText(null);

            return new SocialUserInfo(socialId, email, name, profileImage);
        } catch (Exception e) {
            log.error("Naver 사용자 정보 조회 실패", e);
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    private record SocialUserInfo(String socialId, String email, String name, String profileImage) {}
}
