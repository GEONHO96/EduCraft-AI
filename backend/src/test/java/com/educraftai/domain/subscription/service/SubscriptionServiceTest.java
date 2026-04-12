package com.educraftai.domain.subscription.service;

import com.educraftai.domain.subscription.dto.SubscriptionDto;
import com.educraftai.domain.subscription.entity.Payment;
import com.educraftai.domain.subscription.entity.Subscription;
import com.educraftai.domain.subscription.repository.PaymentRepository;
import com.educraftai.domain.subscription.repository.SubscriptionRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SubscriptionService 단위 테스트")
class SubscriptionServiceTest {

    @InjectMocks private SubscriptionService subscriptionService;
    @Mock private SubscriptionRepository subscriptionRepository;
    @Mock private PaymentRepository paymentRepository;
    @Mock private UserRepository userRepository;

    private User user;
    private Subscription proSubscription;

    @BeforeEach
    void setUp() throws Exception {
        user = User.builder().email("user@edu.com").name("테스트").role(User.Role.STUDENT).build();
        setId(user, 1L);

        proSubscription = Subscription.builder().user(user).build();
        proSubscription.setPlan(Subscription.Plan.PRO);
        proSubscription.setStatus(Subscription.Status.ACTIVE);
        proSubscription.setNextBillingAt(LocalDateTime.now().plusMonths(1));
        setId(proSubscription, 10L);
    }

    private void setId(Object obj, Long id) throws Exception {
        var field = obj.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(obj, id);
    }

    @Nested
    @DisplayName("구독 조회")
    class GetSubscription {

        @Test
        @DisplayName("기존 구독이 있으면 구독 정보를 반환한다")
        void getMySubscription_existing() {
            given(subscriptionRepository.findByUserId(1L)).willReturn(Optional.of(proSubscription));

            SubscriptionDto.SubscriptionInfo result = subscriptionService.getMySubscription(1L);

            assertThat(result.getPlan()).isEqualTo("PRO");
            assertThat(result.getStatus()).isEqualTo("ACTIVE");
        }

        @Test
        @DisplayName("구독이 없으면 COMMUNITY 기본값을 반환한다")
        void getMySubscription_noSubscription_returnsCommunity() {
            given(subscriptionRepository.findByUserId(1L)).willReturn(Optional.empty());

            SubscriptionDto.SubscriptionInfo result = subscriptionService.getMySubscription(1L);

            assertThat(result.getPlan()).isEqualTo("COMMUNITY");
            assertThat(result.getStatus()).isEqualTo("ACTIVE");
        }
    }

    @Nested
    @DisplayName("결제 내역")
    class PaymentHistory {

        @Test
        @DisplayName("결제 내역 목록을 반환한다")
        void getPaymentHistory_returnsList() throws Exception {
            Payment payment = Payment.builder()
                    .user(user).orderId("EDU-TEST123").plan(Subscription.Plan.PRO)
                    .amount(9900).paymentMethod(Payment.PaymentMethod.CREDIT_CARD)
                    .status(Payment.PaymentStatus.COMPLETED).pgTransactionId("PG-TEST").build();
            setId(payment, 100L);
            // @CreationTimestamp는 DB 없이 동작하지 않으므로 수동 설정
            var paidAtField = Payment.class.getDeclaredField("paidAt");
            paidAtField.setAccessible(true);
            paidAtField.set(payment, LocalDateTime.now());

            given(paymentRepository.findByUserIdOrderByPaidAtDesc(1L)).willReturn(List.of(payment));

            List<SubscriptionDto.PaymentInfo> result = subscriptionService.getPaymentHistory(1L);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getOrderId()).isEqualTo("EDU-TEST123");
            assertThat(result.get(0).getAmount()).isEqualTo(9900);
        }

        @Test
        @DisplayName("결제 내역이 없으면 빈 리스트를 반환한다")
        void getPaymentHistory_empty() {
            given(paymentRepository.findByUserIdOrderByPaidAtDesc(1L)).willReturn(List.of());

            List<SubscriptionDto.PaymentInfo> result = subscriptionService.getPaymentHistory(1L);

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("구독 신청")
    class Subscribe {

        @Test
        @DisplayName("PRO 플랜 구독 시 결제를 처리하고 구독을 활성화한다")
        void subscribe_pro_success() {
            SubscriptionDto.SubscribeRequest request = new SubscriptionDto.SubscribeRequest();
            request.setPlan("PRO");
            request.setPaymentMethod("CREDIT_CARD");

            given(userRepository.findById(1L)).willReturn(Optional.of(user));
            given(subscriptionRepository.findByUserId(1L)).willReturn(Optional.empty());
            given(paymentRepository.save(any(Payment.class))).willAnswer(inv -> inv.getArgument(0));
            given(subscriptionRepository.save(any(Subscription.class))).willAnswer(inv -> inv.getArgument(0));

            SubscriptionDto.SubscribeResult result = subscriptionService.subscribe(1L, request);

            assertThat(result.getPlan()).isEqualTo("PRO");
            assertThat(result.getStatus()).isEqualTo("ACTIVE");
            assertThat(result.getAmount()).isEqualTo(9900);
            assertThat(result.getPaymentMethod()).isEqualTo("CREDIT_CARD");
            assertThat(result.getOrderId()).startsWith("EDU-");
            then(paymentRepository).should().save(any(Payment.class));
            then(subscriptionRepository).should().save(any(Subscription.class));
        }

        @Test
        @DisplayName("MAX 플랜 구독 시 19900원이 결제된다")
        void subscribe_max_success() {
            SubscriptionDto.SubscribeRequest request = new SubscriptionDto.SubscribeRequest();
            request.setPlan("MAX");
            request.setPaymentMethod("KAKAO_PAY");

            given(userRepository.findById(1L)).willReturn(Optional.of(user));
            given(subscriptionRepository.findByUserId(1L)).willReturn(Optional.empty());
            given(paymentRepository.save(any(Payment.class))).willAnswer(inv -> inv.getArgument(0));
            given(subscriptionRepository.save(any(Subscription.class))).willAnswer(inv -> inv.getArgument(0));

            SubscriptionDto.SubscribeResult result = subscriptionService.subscribe(1L, request);

            assertThat(result.getAmount()).isEqualTo(19900);
            assertThat(result.getPaymentMethod()).isEqualTo("KAKAO_PAY");
        }

        @Test
        @DisplayName("무료 플랜(COMMUNITY)으로 구독 시 예외를 던진다")
        void subscribe_community_throwsException() {
            SubscriptionDto.SubscribeRequest request = new SubscriptionDto.SubscribeRequest();
            request.setPlan("COMMUNITY");
            request.setPaymentMethod("CREDIT_CARD");

            given(userRepository.findById(1L)).willReturn(Optional.of(user));

            assertThatThrownBy(() -> subscriptionService.subscribe(1L, request))
                    .isInstanceOf(BusinessException.class);
        }
    }

    @Nested
    @DisplayName("구독 취소")
    class Cancel {

        @Test
        @DisplayName("유료 구독을 취소하면 CANCELLED 상태가 된다")
        void cancelSubscription_success() {
            given(subscriptionRepository.findByUserId(1L)).willReturn(Optional.of(proSubscription));
            given(subscriptionRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

            SubscriptionDto.SubscriptionInfo result = subscriptionService.cancelSubscription(1L);

            assertThat(result.getStatus()).isEqualTo("CANCELLED");
            assertThat(result.getPlan()).isEqualTo("PRO");
        }

        @Test
        @DisplayName("무료 플랜 취소 시 예외를 던진다")
        void cancelSubscription_community_throwsException() {
            Subscription communitySub = Subscription.builder().user(user).build();
            communitySub.setPlan(Subscription.Plan.COMMUNITY);
            communitySub.setStatus(Subscription.Status.ACTIVE);

            given(subscriptionRepository.findByUserId(1L)).willReturn(Optional.of(communitySub));

            assertThatThrownBy(() -> subscriptionService.cancelSubscription(1L))
                    .isInstanceOf(BusinessException.class);
        }

        @Test
        @DisplayName("구독이 없으면 취소 시 예외를 던진다")
        void cancelSubscription_noSub_throwsException() {
            given(subscriptionRepository.findByUserId(1L)).willReturn(Optional.empty());

            assertThatThrownBy(() -> subscriptionService.cancelSubscription(1L))
                    .isInstanceOf(BusinessException.class);
        }
    }

    @Nested
    @DisplayName("다운그레이드")
    class Downgrade {

        @Test
        @DisplayName("무료 플랜으로 다운그레이드하면 COMMUNITY가 된다")
        void downgradeToFree_success() {
            given(subscriptionRepository.findByUserId(1L)).willReturn(Optional.of(proSubscription));
            given(subscriptionRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

            SubscriptionDto.SubscriptionInfo result = subscriptionService.downgradeToFree(1L);

            assertThat(result.getPlan()).isEqualTo("COMMUNITY");
            assertThat(result.getStatus()).isEqualTo("ACTIVE");
        }

        @Test
        @DisplayName("기존 구독이 없어도 COMMUNITY를 반환한다")
        void downgradeToFree_noExistingSub() {
            given(subscriptionRepository.findByUserId(1L)).willReturn(Optional.empty());

            SubscriptionDto.SubscriptionInfo result = subscriptionService.downgradeToFree(1L);

            assertThat(result.getPlan()).isEqualTo("COMMUNITY");
        }
    }
}
