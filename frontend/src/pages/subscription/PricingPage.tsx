/**
 * PricingPage - 요금제 플랜 페이지
 * Community(무료) / Pro / Max 플랜 비교 및 결제 기능을 제공한다.
 * 결제 수단: 신용카드, 토스페이, 카카오페이, PayPal(해외결제)
 */
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionApi, SubscriptionInfo } from '../../api/subscription'
import toast from 'react-hot-toast'

type PlanType = 'COMMUNITY' | 'PRO' | 'MAX'
type PaymentMethodType = 'CREDIT_CARD' | 'TOSS_PAY' | 'KAKAO_PAY' | 'PAYPAL'

interface PlanDetail {
  name: PlanType
  displayName: string
  price: number
  priceLabel: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  badgeColor: string
  icon: string
  features: { text: string; included: boolean }[]
  popular?: boolean
}

const PLANS: PlanDetail[] = [
  {
    name: 'COMMUNITY',
    displayName: 'Community',
    price: 0,
    priceLabel: '무료',
    description: '기본 학습 기능을 무료로 이용하세요',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    badgeColor: 'bg-gray-100 text-gray-600',
    icon: '🌱',
    features: [
      { text: 'AI 퀴즈 하루 3회', included: true },
      { text: '강의 탐색 & 수강', included: true },
      { text: '커뮤니티 피드', included: true },
      { text: '학년별 강의 추천', included: true },
      { text: 'AI 커리큘럼 생성', included: false },
      { text: 'AI 수업 자료 생성', included: false },
      { text: 'AI 챗봇 무제한', included: false },
      { text: 'AI 보충학습', included: false },
      { text: '성적 분석 리포트', included: false },
      { text: '광고 제거', included: false },
    ],
  },
  {
    name: 'PRO',
    displayName: 'Pro',
    price: 9900,
    priceLabel: '9,900',
    description: '더 많은 AI 기능으로 학습 효율을 높이세요',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    icon: '🚀',
    popular: true,
    features: [
      { text: 'AI 퀴즈 무제한', included: true },
      { text: '강의 탐색 & 수강', included: true },
      { text: '커뮤니티 피드', included: true },
      { text: '학년별 강의 추천', included: true },
      { text: 'AI 커리큘럼 생성', included: true },
      { text: 'AI 수업 자료 생성', included: true },
      { text: 'AI 챗봇 무제한', included: true },
      { text: 'AI 보충학습', included: true },
      { text: '성적 분석 리포트', included: false },
      { text: '광고 제거', included: false },
    ],
  },
  {
    name: 'MAX',
    displayName: 'Max',
    price: 19900,
    priceLabel: '19,900',
    description: '모든 프리미엄 기능을 제한 없이 사용하세요',
    color: 'text-amber-700',
    bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
    borderColor: 'border-amber-300',
    badgeColor: 'bg-amber-100 text-amber-700',
    icon: '👑',
    features: [
      { text: 'AI 퀴즈 무제한', included: true },
      { text: '강의 탐색 & 수강', included: true },
      { text: '커뮤니티 피드', included: true },
      { text: '학년별 강의 추천', included: true },
      { text: 'AI 커리큘럼 생성', included: true },
      { text: 'AI 수업 자료 생성', included: true },
      { text: 'AI 챗봇 우선 응답', included: true },
      { text: 'AI 보충학습', included: true },
      { text: '성적 분석 리포트', included: true },
      { text: '광고 제거', included: true },
    ],
  },
]

const PAYMENT_METHODS: { id: PaymentMethodType; name: string; icon: string; description: string }[] = [
  { id: 'CREDIT_CARD', name: '신용/체크카드', icon: '💳', description: 'Visa, Mastercard, 국내 전 카드사' },
  { id: 'TOSS_PAY', name: '토스페이', icon: '🔵', description: '토스 간편결제' },
  { id: 'KAKAO_PAY', name: '카카오페이', icon: '💛', description: '카카오 간편결제' },
  { id: 'PAYPAL', name: 'PayPal', icon: '🌐', description: '해외 결제 (USD)' },
]

export default function PricingPage() {
  const queryClient = useQueryClient()

  // 현재 구독 정보 조회
  const { data: subscription } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: async () => {
      const res = await subscriptionApi.getMySubscription()
      return res.data.data
    },
  })

  // 결제 내역 조회
  const { data: payments } = useQuery({
    queryKey: ['payment-history'],
    queryFn: async () => {
      const res = await subscriptionApi.getPaymentHistory()
      return res.data.data
    },
  })

  const currentPlan = subscription?.plan || 'COMMUNITY'

  // 결제 모달 상태
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('CREDIT_CARD')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [payStep, setPayStep] = useState<'method' | 'processing' | 'complete'>('method')
  const [payResult, setPayResult] = useState<{ orderId: string; amount: number } | null>(null)

  // 취소 확인 모달
  const [showCancelModal, setShowCancelModal] = useState(false)

  // 구독 신청
  const subscribeMutation = useMutation({
    mutationFn: (data: { plan: string; paymentMethod: string; cardNumber?: string; cardExpiry?: string }) =>
      subscriptionApi.subscribe(data),
    onSuccess: (res) => {
      const result = res.data.data
      setPayResult({ orderId: result.orderId, amount: result.amount })
      setPayStep('complete')
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
      queryClient.invalidateQueries({ queryKey: ['payment-history'] })
    },
    onError: () => {
      toast.error('결제에 실패했습니다. 다시 시도해주세요.')
      setPayStep('method')
    },
  })

  // 구독 취소
  const cancelMutation = useMutation({
    mutationFn: () => subscriptionApi.cancel(),
    onSuccess: () => {
      toast.success('구독이 취소되었습니다.')
      setShowCancelModal(false)
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    },
  })

  const openPayModal = (plan: PlanType) => {
    setSelectedPlan(plan)
    setPaymentMethod('CREDIT_CARD')
    setCardNumber('')
    setCardExpiry('')
    setCardCvc('')
    setAgreedTerms(false)
    setPayStep('method')
    setPayResult(null)
    setShowPayModal(true)
  }

  const handlePay = () => {
    if (!selectedPlan) return
    if (paymentMethod === 'CREDIT_CARD' && (!cardNumber || !cardExpiry || !cardCvc)) {
      toast.error('카드 정보를 모두 입력해주세요')
      return
    }
    if (!agreedTerms) {
      toast.error('이용약관에 동의해주세요')
      return
    }
    setPayStep('processing')
    // 실제 결제 처리 딜레이 시뮬레이션
    setTimeout(() => {
      subscribeMutation.mutate({
        plan: selectedPlan,
        paymentMethod,
        cardNumber: paymentMethod === 'CREDIT_CARD' ? cardNumber.replace(/\s/g, '') : undefined,
        cardExpiry: paymentMethod === 'CREDIT_CARD' ? cardExpiry : undefined,
      })
    }, 2000)
  }

  // 카드번호 포맷팅
  const formatCardNumber = (v: string) => {
    const nums = v.replace(/\D/g, '').slice(0, 16)
    return nums.replace(/(\d{4})(?=\d)/g, '$1 ')
  }
  const formatExpiry = (v: string) => {
    const nums = v.replace(/\D/g, '').slice(0, 4)
    if (nums.length > 2) return nums.slice(0, 2) + '/' + nums.slice(2)
    return nums
  }

  const selectedPlanDetail = PLANS.find(p => p.name === selectedPlan)

  // 결제 수단 이름
  const methodName = (m: string) => PAYMENT_METHODS.find(p => p.id === m)?.name || m

  return (
    <div>
      {/* 헤더 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">요금제</h1>
        <p className="text-gray-500 mt-2">나에게 맞는 플랜을 선택하고, AI 학습의 가능성을 열어보세요</p>
      </div>

      {/* ====== 플랜 카드 ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.name
          return (
            <div key={plan.name} className={`relative rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
              plan.popular ? 'border-indigo-400 shadow-md scale-[1.02]' : plan.borderColor
            } ${plan.bgColor}`}>
              {/* 인기 배지 */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                    가장 인기
                  </span>
                </div>
              )}

              {/* 현재 플랜 배지 */}
              {isCurrent && (
                <div className="absolute top-4 right-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan.badgeColor}`}>
                    현재 플랜
                  </span>
                </div>
              )}

              <div className="text-4xl mb-3">{plan.icon}</div>
              <h3 className={`text-xl font-extrabold ${plan.color}`}>{plan.displayName}</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">{plan.description}</p>

              {/* 가격 */}
              <div className="mb-6">
                {plan.price === 0 ? (
                  <div className={`text-3xl font-extrabold ${plan.color}`}>무료</div>
                ) : (
                  <div className="flex items-end gap-1">
                    <span className={`text-3xl font-extrabold ${plan.color}`}>{plan.priceLabel}</span>
                    <span className="text-sm text-gray-500 mb-1">원/월</span>
                  </div>
                )}
              </div>

              {/* 기능 목록 */}
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    {f.included ? (
                      <svg className="w-4.5 h-4.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={f.included ? 'text-gray-700' : 'text-gray-400'}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* 버튼 */}
              {isCurrent ? (
                currentPlan !== 'COMMUNITY' ? (
                  <button onClick={() => setShowCancelModal(true)}
                    className="w-full py-3 border-2 border-gray-300 text-gray-500 rounded-xl font-semibold hover:bg-gray-100 transition text-sm">
                    구독 취소
                  </button>
                ) : (
                  <button disabled className="w-full py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold text-sm cursor-default">
                    현재 이용 중
                  </button>
                )
              ) : (
                <button onClick={() => plan.name !== 'COMMUNITY' ? openPayModal(plan.name) : null}
                  className={`w-full py-3 rounded-xl font-semibold transition text-sm ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                      : plan.name === 'MAX'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}>
                  {plan.name === 'COMMUNITY' ? '무료로 시작' : `${plan.displayName} 시작하기`}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* ====== 결제 내역 ====== */}
      {payments && payments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">결제 내역</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">주문번호</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">플랜</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">금액</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">결제수단</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">상태</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">결제일</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-mono text-xs text-gray-600">{p.orderId}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.plan === 'MAX' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>{p.plan}</span>
                    </td>
                    <td className="py-3 px-2 font-semibold">{p.amount.toLocaleString()}원</td>
                    <td className="py-3 px-2 text-gray-600">{methodName(p.paymentMethod)}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        p.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                      }`}>{p.status === 'COMPLETED' ? '완료' : p.status === 'CANCELLED' ? '취소' : '환불'}</span>
                    </td>
                    <td className="py-3 px-2 text-gray-500 text-xs">{new Date(p.paidAt).toLocaleDateString('ko-KR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====== 플랜 비교표 ====== */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">플랜 상세 비교</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-3 px-3 text-gray-500">기능</th>
                <th className="text-center py-3 px-3 text-gray-700 font-bold">🌱 Community</th>
                <th className="text-center py-3 px-3 text-indigo-700 font-bold">🚀 Pro</th>
                <th className="text-center py-3 px-3 text-amber-700 font-bold">👑 Max</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['AI 퀴즈', '하루 3회', '무제한', '무제한'],
                ['강의 탐색 & 수강', '✅', '✅', '✅'],
                ['커뮤니티', '✅', '✅', '✅'],
                ['강의 추천', '✅', '✅', '✅'],
                ['AI 커리큘럼 생성', '❌', '✅', '✅'],
                ['AI 수업 자료 생성', '❌', '✅', '✅'],
                ['AI 챗봇', '기본 응답', '무제한', '우선 응답'],
                ['AI 보충학습', '❌', '✅', '✅'],
                ['성적 분석 리포트', '❌', '❌', '✅'],
                ['광고 제거', '❌', '❌', '✅'],
                ['가격', '무료', '월 9,900원', '월 19,900원'],
              ].map(([label, c, p, m], i) => (
                <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                  <td className="py-2.5 px-3 font-medium text-gray-700">{label}</td>
                  <td className="py-2.5 px-3 text-center text-gray-600">{c}</td>
                  <td className="py-2.5 px-3 text-center text-gray-600">{p}</td>
                  <td className="py-2.5 px-3 text-center text-gray-600">{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== 결제 모달 ====== */}
      {showPayModal && selectedPlanDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => payStep !== 'processing' && setShowPayModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* 결제 헤더 */}
            <div className={`px-6 py-5 rounded-t-2xl ${
              selectedPlan === 'MAX' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedPlanDetail.icon}</span>
                  <div>
                    <h3 className="text-white font-extrabold text-lg">{selectedPlanDetail.displayName} 플랜</h3>
                    <p className="text-white/80 text-sm">월 {selectedPlanDetail.priceLabel}원</p>
                  </div>
                </div>
                {payStep !== 'processing' && (
                  <button onClick={() => setShowPayModal(false)} className="text-white/70 hover:text-white transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: 결제 수단 선택 */}
              {payStep === 'method' && (
                <>
                  <h4 className="font-bold text-gray-800 mb-4">결제 수단 선택</h4>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {PAYMENT_METHODS.map((m) => (
                      <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                        className={`p-4 rounded-xl border-2 text-left transition ${
                          paymentMethod === m.id
                            ? 'border-indigo-400 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}>
                        <div className="text-2xl mb-1">{m.icon}</div>
                        <div className="font-semibold text-sm text-gray-800">{m.name}</div>
                        <div className="text-xs text-gray-500">{m.description}</div>
                      </button>
                    ))}
                  </div>

                  {/* 카드 정보 입력 (신용카드 선택 시) */}
                  {paymentMethod === 'CREDIT_CARD' && (
                    <div className="space-y-3 mb-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">카드 번호</label>
                        <input type="text" placeholder="1234 5678 9012 3456"
                          value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">만료일</label>
                          <input type="text" placeholder="MM/YY"
                            value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">CVC</label>
                          <input type="password" placeholder="123" maxLength={4}
                            value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 간편결제 안내 */}
                  {paymentMethod !== 'CREDIT_CARD' && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
                      <p className="text-sm text-gray-600">
                        <span className="text-2xl block mb-2">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.icon}</span>
                        {paymentMethod === 'TOSS_PAY' && '결제 버튼을 누르면 토스 앱으로 연결됩니다'}
                        {paymentMethod === 'KAKAO_PAY' && '결제 버튼을 누르면 카카오페이로 연결됩니다'}
                        {paymentMethod === 'PAYPAL' && '결제 버튼을 누르면 PayPal 페이지로 연결됩니다'}
                      </p>
                    </div>
                  )}

                  {/* 결제 요약 */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{selectedPlanDetail.displayName} 플랜 (월간)</span>
                      <span className="font-semibold">{selectedPlanDetail.priceLabel}원</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">부가세 (포함)</span>
                      <span className="text-gray-500">-</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-bold text-gray-800">총 결제 금액</span>
                      <span className="font-extrabold text-lg text-indigo-600">{selectedPlanDetail.priceLabel}원</span>
                    </div>
                  </div>

                  {/* 이용약관 동의 */}
                  <label className="flex items-start gap-2 mb-5 cursor-pointer">
                    <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 accent-indigo-600" />
                    <span className="text-xs text-gray-600">
                      <span className="text-indigo-600 underline">이용약관</span> 및 <span className="text-indigo-600 underline">개인정보처리방침</span>에 동의하며,
                      월간 자동 결제에 동의합니다. 언제든지 취소할 수 있습니다.
                    </span>
                  </label>

                  <button onClick={handlePay} disabled={!agreedTerms}
                    className={`w-full py-3.5 rounded-xl font-bold transition text-sm ${
                      selectedPlan === 'MAX'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'
                    } disabled:cursor-not-allowed`}>
                    {selectedPlanDetail.priceLabel}원 결제하기
                  </button>

                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      SSL 보안 결제
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      안전 결제 보장
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: 결제 진행 중 */}
              {payStep === 'processing' && (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                    <svg className="w-10 h-10 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">결제 처리 중...</h3>
                  <p className="text-gray-500 text-sm">잠시만 기다려주세요</p>
                </div>
              )}

              {/* Step 3: 결제 완료 */}
              {payStep === 'complete' && payResult && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">결제가 완료되었습니다!</h3>
                  <p className="text-gray-500 text-sm mb-6">{selectedPlanDetail?.displayName} 플랜을 이용할 수 있습니다</p>

                  <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                    <div className="flex justify-between text-sm py-1.5">
                      <span className="text-gray-500">주문번호</span>
                      <span className="font-mono text-gray-800">{payResult.orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1.5">
                      <span className="text-gray-500">결제 금액</span>
                      <span className="font-bold text-gray-800">{payResult.amount.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-sm py-1.5">
                      <span className="text-gray-500">결제 수단</span>
                      <span className="text-gray-800">{methodName(paymentMethod)}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1.5">
                      <span className="text-gray-500">플랜</span>
                      <span className="font-bold">{selectedPlanDetail?.icon} {selectedPlanDetail?.displayName}</span>
                    </div>
                  </div>

                  <button onClick={() => setShowPayModal(false)}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition text-sm">
                    확인
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====== 취소 확인 모달 ====== */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-1">구독을 취소하시겠습니까?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">
              취소하면 현재 결제 기간이 끝난 후<br/>Community(무료) 플랜으로 변경됩니다.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition text-sm">
                유지하기
              </button>
              <button onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition text-sm disabled:opacity-50">
                {cancelMutation.isPending ? '처리 중...' : '구독 취소'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
