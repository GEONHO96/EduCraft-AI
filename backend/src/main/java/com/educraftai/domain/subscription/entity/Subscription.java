package com.educraftai.domain.subscription.entity;

import com.educraftai.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Subscription - 사용자 구독 정보
 * Community(무료), Pro, Max 플랜을 관리한다.
 */
@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Plan plan = Plan.COMMUNITY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.ACTIVE;

    /** 구독 시작일 */
    @CreationTimestamp
    private LocalDateTime startedAt;

    /** 다음 결제일 (유료 플랜) */
    private LocalDateTime nextBillingAt;

    /** 구독 만료/취소일 */
    private LocalDateTime cancelledAt;

    public enum Plan {
        COMMUNITY,  // 무료
        PRO,        // 월 9,900원
        MAX         // 월 19,900원
    }

    public enum Status {
        ACTIVE,     // 활성
        CANCELLED,  // 취소 (기간 만료 전)
        EXPIRED     // 만료
    }
}
