package com.educraftai.domain.user.service;

import com.educraftai.domain.user.dto.AuthResponse;
import com.educraftai.domain.user.dto.SocialAuthRequest;
import com.educraftai.domain.user.dto.SocialCodeRequest;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import com.educraftai.global.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
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

    @Value("${social.naver.client-id:}")
    private String naverClientId;

    @Value("${social.naver.client-secret:}")
    private String naverClientSecret;

    @Value("${social.kakao.client-id:}")
    private String kakaoClientId;

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
            // 닉네임이 설정되지 않은 경우에만 이름 업데이트
            if (user.getNickname() == null || user.getNickname().isBlank()) {
                user.setName(socialUser.name());
            }
            user.setProfileImage(socialUser.profileImage());

            // 기존 이메일이 폴백(socialId@naver.com 등) 형태이고, 실제 이메일을 받은 경우 업데이트
            if (isFallbackEmail(user.getEmail()) && !isFallbackEmail(socialUser.email())) {
                log.info("[소셜 로그인] 이메일 업데이트: {} → {}", user.getEmail(), socialUser.email());
                user.setEmail(socialUser.email());
            }
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

    /**
     * Authorization Code 기반 소셜 로그인
     * 프론트엔드에서 받은 code를 백엔드에서 access token으로 교환 후 로그인 처리
     * (Naver/Kakao는 CORS로 인해 브라우저에서 직접 토큰 교환 불가)
     */
    public AuthResponse.Token socialLoginWithCode(SocialCodeRequest request) {
        log.info("[소셜 코드 로그인 요청] provider={}", request.getProvider());

        String accessToken = switch (request.getProvider()) {
            case KAKAO -> exchangeKakaoCode(request.getCode(), request.getRedirectUri());
            case NAVER -> exchangeNaverCode(request.getCode(), request.getState());
            default -> throw new BusinessException(ErrorCode.INVALID_INPUT);
        };

        // 기존 socialLogin 로직 재사용
        SocialAuthRequest authRequest = new SocialAuthRequest();
        authRequest.setAccessToken(accessToken);
        authRequest.setProvider(request.getProvider());
        authRequest.setRole(request.getRole());
        return socialLogin(authRequest);
    }

    /** 네이버 authorization code → access token 교환 */
    private String exchangeNaverCode(String code, String state) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", naverClientId);
            params.add("client_secret", naverClientSecret);
            params.add("code", code);
            params.add("state", state);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://nid.naver.com/oauth2.0/token", entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            String accessToken = root.path("access_token").asText(null);

            if (accessToken == null || accessToken.isEmpty()) {
                log.error("Naver 토큰 교환 실패: {}", response.getBody());
                throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
            }

            log.debug("[Naver 토큰 교환 성공]");
            return accessToken;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Naver 토큰 교환 실패", e);
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    /** 카카오 authorization code → access token 교환 */
    private String exchangeKakaoCode(String code, String redirectUri) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", kakaoClientId);
            params.add("redirect_uri", redirectUri);
            params.add("code", code);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://kauth.kakao.com/oauth/token", entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            String accessToken = root.path("access_token").asText(null);

            if (accessToken == null || accessToken.isEmpty()) {
                log.error("Kakao 토큰 교환 실패: {}", response.getBody());
                throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
            }

            log.debug("[Kakao 토큰 교환 성공]");
            return accessToken;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Kakao 토큰 교환 실패", e);
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
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

            log.info("[Naver API 응답] resultcode={}, fields={}", root.path("resultcode").asText(), responseNode.fieldNames());
            log.debug("[Naver API 상세] response={}", responseNode.toString());

            String socialId = responseNode.path("id").asText();

            // 이메일: email 필드 우선, 없으면 socialId 기반 폴백
            String email = null;
            if (responseNode.has("email") && !responseNode.path("email").asText("").isBlank()) {
                email = responseNode.path("email").asText();
            }
            if (email == null || email.isBlank()) {
                log.warn("[Naver] 이메일 미제공 — 네이버 개발자 콘솔에서 '이메일 주소' 권한을 '필수'로 설정하세요. socialId={}", socialId);
                email = socialId + "@naver.com";
            }

            // 이름: nickname 우선 → name → 폴백
            String nickname = responseNode.path("nickname").asText("");
            String realName = responseNode.path("name").asText("");
            String name = !nickname.isBlank() ? nickname : (!realName.isBlank() ? realName : "네이버 사용자");

            String profileImage = responseNode.path("profile_image").asText(null);

            log.info("[Naver 사용자 정보] email={}, name={}, hasProfileImage={}", email, name, profileImage != null);
            return new SocialUserInfo(socialId, email, name, profileImage);
        } catch (Exception e) {
            log.error("Naver 사용자 정보 조회 실패", e);
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    /** 폴백 이메일 여부 판단 (socialId 기반 자동 생성 이메일) */
    private boolean isFallbackEmail(String email) {
        if (email == null) return true;
        // 일반적인 이메일 형식이 아닌 긴 해시 문자열 기반 이메일 감지
        String localPart = email.contains("@") ? email.substring(0, email.indexOf("@")) : email;
        return localPart.length() > 30;
    }

    private record SocialUserInfo(String socialId, String email, String name, String profileImage) {}
}
