package com.educraftai.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 사용자 엔티티
 * 선생님(TEACHER)과 학생(STUDENT) 역할을 가지며, 소셜 로그인도 지원한다.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 로그인용 이메일 (고유값) */
    @Column(nullable = false, unique = true)
    private String email;

    /** 암호화된 비밀번호 (소셜 로그인 시 null) */
    private String password;

    @Column(nullable = false)
    private String name;

    /** 사용자가 직접 설정한 닉네임 (null이면 name 사용) */
    private String nickname;

    /** 사용자 역할: TEACHER 또는 STUDENT */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /** 소셜 로그인 제공자 (LOCAL이면 일반 가입) */
    @Enumerated(EnumType.STRING)
    private SocialProvider socialProvider;

    /** 소셜 로그인 제공자 측 고유 ID */
    private String socialId;

    private String profileImage;

    /** 학생 학년 정보 (예: ELEMENTARY_1, MIDDLE_2, HIGH_3) */
    private String grade;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum Role {
        TEACHER, STUDENT
    }

    public enum SocialProvider {
        LOCAL, GOOGLE, KAKAO, NAVER
    }
}
