import apiClient from './client'
import type { ApiResponse } from '../types/api'

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
    apiClient.get<ApiResponse<SubscriptionInfo>>('/subscriptions/me'),

  getPaymentHistory: () =>
    apiClient.get<ApiResponse<PaymentInfo[]>>('/subscriptions/payments'),

  subscribe: (data: SubscribeRequest) =>
    apiClient.post<ApiResponse<SubscribeResult>>('/subscriptions/subscribe', data),

  cancel: () =>
    apiClient.post<ApiResponse<SubscriptionInfo>>('/subscriptions/cancel'),

  downgrade: () =>
    apiClient.post<ApiResponse<SubscriptionInfo>>('/subscriptions/downgrade'),
}
