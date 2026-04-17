package com.educraftai.domain.subscription.controller;

import com.educraftai.domain.subscription.dto.SubscriptionDto;
import com.educraftai.domain.subscription.service.SubscriptionService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.CurrentUserId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 구독 & 결제 API 컨트롤러.
 * <p>플랜 조회, 구독 신청·취소·다운그레이드, 결제 내역 관리를 제공한다.
 * <p>URL: {@code /api/subscriptions/**} (복수형으로 다른 리소스 컨트롤러와 통일).
 */
@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /** 내 구독 상태 조회 */
    @GetMapping("/me")
    public ApiResponse<SubscriptionDto.SubscriptionInfo> getMySubscription(@CurrentUserId Long userId) {
        return ApiResponse.ok(subscriptionService.getMySubscription(userId));
    }

    /** 결제 내역 조회 */
    @GetMapping("/payments")
    public ApiResponse<List<SubscriptionDto.PaymentInfo>> getPaymentHistory(@CurrentUserId Long userId) {
        return ApiResponse.ok(subscriptionService.getPaymentHistory(userId));
    }

    /** 구독 신청 (결제) */
    @PostMapping("/subscribe")
    public ApiResponse<SubscriptionDto.SubscribeResult> subscribe(@CurrentUserId Long userId,
                                                                  @Valid @RequestBody SubscriptionDto.SubscribeRequest request) {
        return ApiResponse.ok(subscriptionService.subscribe(userId, request));
    }

    /** 구독 취소 (기간 만료 전까지 유지) */
    @PostMapping("/cancel")
    public ApiResponse<SubscriptionDto.SubscriptionInfo> cancelSubscription(@CurrentUserId Long userId) {
        return ApiResponse.ok(subscriptionService.cancelSubscription(userId));
    }

    /** 무료(COMMUNITY) 플랜으로 즉시 다운그레이드 */
    @PostMapping("/downgrade")
    public ApiResponse<SubscriptionDto.SubscriptionInfo> downgrade(@CurrentUserId Long userId) {
        return ApiResponse.ok(subscriptionService.downgradeToFree(userId));
    }
}
