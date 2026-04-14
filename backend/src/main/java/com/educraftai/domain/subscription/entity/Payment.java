package com.educraftai.domain.subscription.entity;

import com.educraftai.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Payment - 결제 내역
 * 각 결제 건의 금액, 결제 수단, 상태 등을 기록한다.
 */
@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payment_user", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 결제 고유 주문번호 */
    @Column(nullable = false, unique = true, length = 50)
    private String orderId;

    /** 구독 플랜 */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Subscription.Plan plan;

    /** 결제 금액 (원) */
    @Column(nullable = false)
    private Integer amount;

    /** 결제 수단 */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    /** 결제 상태 */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.COMPLETED;

    /** PG사 거래 ID */
    private String pgTransactionId;

    @CreationTimestamp
    private LocalDateTime paidAt;

    public enum PaymentMethod {
        CREDIT_CARD,    // 신용카드
        TOSS_PAY,       // 토스페이
        KAKAO_PAY,      // 카카오페이
        PAYPAL          // 해외 결제 (PayPal)
    }

    public enum PaymentStatus {
        COMPLETED,      // 결제 완료
        CANCELLED,      // 결제 취소
        REFUNDED        // 환불
    }
}
