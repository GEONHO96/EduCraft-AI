package com.educraftai.domain.subscription.controller;

import com.educraftai.domain.subscription.dto.SubscriptionDto;
import com.educraftai.domain.subscription.service.SubscriptionService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * SubscriptionController - 구독 & 결제 API
 * 플랜 조회, 구독 신청/취소, 결제 내역 관리를 제공한다.
 */
@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /** 현재 구독 상태 조회 */
    @GetMapping("/me")
    public ApiResponse<SubscriptionDto.SubscriptionInfo> getMySubscription() {
        return ApiResponse.ok(subscriptionService.getMySubscription(AuthUtil.getCurrentUserId()));
    }

    /** 결제 내역 조회 */
    @GetMapping("/payments")
    public ApiResponse<List<SubscriptionDto.PaymentInfo>> getPaymentHistory() {
        return ApiResponse.ok(subscriptionService.getPaymentHistory(AuthUtil.getCurrentUserId()));
    }

    /** 구독 신청 (결제) */
    @PostMapping("/subscribe")
    public ApiResponse<SubscriptionDto.SubscribeResult> subscribe(
            @RequestBody SubscriptionDto.SubscribeRequest request) {
        return ApiResponse.ok(subscriptionService.subscribe(AuthUtil.getCurrentUserId(), request));
    }

    /** 구독 취소 */
    @PostMapping("/cancel")
    public ApiResponse<SubscriptionDto.SubscriptionInfo> cancelSubscription() {
        return ApiResponse.ok(subscriptionService.cancelSubscription(AuthUtil.getCurrentUserId()));
    }

    /** 무료 플랜으로 변경 */
    @PostMapping("/downgrade")
    public ApiResponse<SubscriptionDto.SubscriptionInfo> downgrade() {
        return ApiResponse.ok(subscriptionService.downgradeToFree(AuthUtil.getCurrentUserId()));
    }
}
