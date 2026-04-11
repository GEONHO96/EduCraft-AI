import apiClient from './client'

export interface SubscriptionInfo {
  plan: 'COMMUNITY' | 'PRO' | 'MAX'
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
  startedAt?: string
  nextBillingAt?: string
  cancelledAt?: string
}

export interface PaymentInfo {
  id: number
  orderId: string
  plan: string
  amount: number
  paymentMethod: string
  status: string
  paidAt: string
}

export interface SubscribeRequest {
  plan: string
  paymentMethod: string
  cardNumber?: string
  cardExpiry?: string
}

export interface SubscribeResult {
  plan: string
  status: string
  orderId: string
  amount: number
  paymentMethod: string
  nextBillingAt: string
}

export const subscriptionApi = {
  getMySubscription: () =>
    apiClient.get<{ success: boolean; data: SubscriptionInfo }>('/subscription/me'),

  getPaymentHistory: () =>
    apiClient.get<{ success: boolean; data: PaymentInfo[] }>('/subscription/payments'),

  subscribe: (data: SubscribeRequest) =>
    apiClient.post<{ success: boolean; data: SubscribeResult }>('/subscription/subscribe', data),

  cancel: () =>
    apiClient.post<{ success: boolean; data: SubscriptionInfo }>('/subscription/cancel'),

  downgrade: () =>
    apiClient.post<{ success: boolean; data: SubscriptionInfo }>('/subscription/downgrade'),
}
