package com.educraftai.domain.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class SubscriptionDto {

    // ====== Request ======

    @Getter @Setter
    public static class SubscribeRequest {
        private String plan;            // PRO, MAX
        private String paymentMethod;   // CREDIT_CARD, TOSS_PAY, KAKAO_PAY, PAYPAL
        private String cardNumber;      // 신용카드 번호 (마스킹 저장)
        private String cardExpiry;      // 카드 만료일
    }

    @Getter @Setter
    public static class CancelRequest {
        private String reason;
    }

    // ====== Response ======

    @Getter @Builder @AllArgsConstructor
    public static class SubscriptionInfo {
        private String plan;
        private String status;
        private String startedAt;
        private String nextBillingAt;
        private String cancelledAt;
    }

    @Getter @Builder @AllArgsConstructor
    public static class PaymentInfo {
        private Long id;
        private String orderId;
        private String plan;
        private Integer amount;
        private String paymentMethod;
        private String status;
        private String paidAt;
    }

    @Getter @Builder @AllArgsConstructor
    public static class SubscribeResult {
        private String plan;
        private String status;
        private String orderId;
        private Integer amount;
        private String paymentMethod;
        private String nextBillingAt;
    }

    @Getter @Builder @AllArgsConstructor
    public static class PlanInfo {
        private String name;
        private String displayName;
        private Integer monthlyPrice;
        private List<String> features;
        private boolean current;
    }
}
