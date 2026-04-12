package com.educraftai.domain.subscription.service;

import com.educraftai.domain.subscription.dto.SubscriptionDto;
import com.educraftai.domain.subscription.entity.Payment;
import com.educraftai.domain.subscription.entity.Subscription;
import com.educraftai.domain.subscription.repository.PaymentRepository;
import com.educraftai.domain.subscription.repository.SubscriptionRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    /** 플랜별 월 가격 */
    private int getPlanPrice(Subscription.Plan plan) {
        return switch (plan) {
            case COMMUNITY -> 0;
            case PRO -> 9900;
            case MAX -> 19900;
        };
    }

    /** 현재 구독 정보 조회 */
    public SubscriptionDto.SubscriptionInfo getMySubscription(Long userId) {
        return subscriptionRepository.findByUserId(userId)
                .map(this::toSubscriptionInfo)
                .orElse(defaultCommunityInfo());
    }

    /** 결제 내역 조회 */
    public List<SubscriptionDto.PaymentInfo> getPaymentHistory(Long userId) {
        return paymentRepository.findByUserIdOrderByPaidAtDesc(userId).stream()
                .map(p -> SubscriptionDto.PaymentInfo.builder()
                        .id(p.getId())
                        .orderId(p.getOrderId())
                        .plan(p.getPlan().name())
                        .amount(p.getAmount())
                        .paymentMethod(p.getPaymentMethod().name())
                        .status(p.getStatus().name())
                        .paidAt(p.getPaidAt().toString())
                        .build())
                .toList();
    }

    /** 구독 신청 (결제 처리) */
    @Transactional
    public SubscriptionDto.SubscribeResult subscribe(Long userId, SubscriptionDto.SubscribeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Subscription.Plan plan = Subscription.Plan.valueOf(request.getPlan());
        Payment.PaymentMethod paymentMethod = Payment.PaymentMethod.valueOf(request.getPaymentMethod());
        int amount = getPlanPrice(plan);

        if (plan == Subscription.Plan.COMMUNITY) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "무료 플랜은 별도 결제가 필요하지 않습니다.");
        }

        // 결제 처리 (실제로는 PG사 연동)
        String orderId = "EDU-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        String pgTxId = "PG-" + UUID.randomUUID().toString().substring(0, 16).toUpperCase();

        log.info("결제 처리: userId={}, plan={}, amount={}, method={}, orderId={}",
                userId, plan, amount, paymentMethod, orderId);

        // 결제 내역 저장
        Payment payment = Payment.builder()
                .user(user)
                .orderId(orderId)
                .plan(plan)
                .amount(amount)
                .paymentMethod(paymentMethod)
                .status(Payment.PaymentStatus.COMPLETED)
                .pgTransactionId(pgTxId)
                .build();
        paymentRepository.save(payment);

        // 구독 생성/업데이트
        LocalDateTime nextBilling = LocalDateTime.now().plusMonths(1);
        Subscription subscription = subscriptionRepository.findByUserId(userId)
                .orElse(Subscription.builder().user(user).build());

        subscription.setPlan(plan);
        subscription.setStatus(Subscription.Status.ACTIVE);
        subscription.setNextBillingAt(nextBilling);
        subscription.setCancelledAt(null);
        subscriptionRepository.save(subscription);

        return SubscriptionDto.SubscribeResult.builder()
                .plan(plan.name())
                .status("ACTIVE")
                .orderId(orderId)
                .amount(amount)
                .paymentMethod(paymentMethod.name())
                .nextBillingAt(nextBilling.toString())
                .build();
    }

    /** 구독 취소 */
    @Transactional
    public SubscriptionDto.SubscriptionInfo cancelSubscription(Long userId) {
        Subscription sub = subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "구독 정보가 없습니다."));

        if (sub.getPlan() == Subscription.Plan.COMMUNITY) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "무료 플랜은 취소할 수 없습니다.");
        }

        sub.setStatus(Subscription.Status.CANCELLED);
        sub.setCancelledAt(LocalDateTime.now());
        subscriptionRepository.save(sub);

        return toSubscriptionInfo(sub);
    }

    /** 플랜 다운그레이드 (Community로) */
    @Transactional
    public SubscriptionDto.SubscriptionInfo downgradeToFree(Long userId) {
        Subscription sub = subscriptionRepository.findByUserId(userId).orElse(null);
        if (sub != null) {
            sub.setPlan(Subscription.Plan.COMMUNITY);
            sub.setStatus(Subscription.Status.ACTIVE);
            sub.setNextBillingAt(null);
            sub.setCancelledAt(null);
            subscriptionRepository.save(sub);
        }
        return defaultCommunityInfo();
    }

    /** Subscription → SubscriptionInfo 변환 (중복 제거) */
    private SubscriptionDto.SubscriptionInfo toSubscriptionInfo(Subscription sub) {
        return SubscriptionDto.SubscriptionInfo.builder()
                .plan(sub.getPlan().name())
                .status(sub.getStatus().name())
                .startedAt(sub.getStartedAt() != null ? sub.getStartedAt().toString() : null)
                .nextBillingAt(sub.getNextBillingAt() != null ? sub.getNextBillingAt().toString() : null)
                .cancelledAt(sub.getCancelledAt() != null ? sub.getCancelledAt().toString() : null)
                .build();
    }

    /** 기본 COMMUNITY 구독 정보 */
    private SubscriptionDto.SubscriptionInfo defaultCommunityInfo() {
        return SubscriptionDto.SubscriptionInfo.builder()
                .plan("COMMUNITY")
                .status("ACTIVE")
                .build();
    }
}
