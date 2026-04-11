/**
 * GradeQuizPage - 학년별 AI 퀴즈 페이지
 * 학년과 과목을 선택하면 해당 수준에 맞는 퀴즈를 제공하고,
 * 바로 풀고 결과를 확인할 수 있다.
 * 한국 교육과정 기반 문제 데이터를 내장하여 오프라인에서도 동작한다.
 */
import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

// ====== 타입 정의 ======
interface Question {
  number: number
  type: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER'
  question: string
  options?: string[]
  answer: number | string
  explanation: string
}

type Phase = 'setup' | 'loading' | 'quiz' | 'result'

const GRADE_OPTIONS = [
  { group: '초등학교', items: [
    { value: 'ELEMENTARY_1', label: '1학년' }, { value: 'ELEMENTARY_2', label: '2학년' },
    { value: 'ELEMENTARY_3', label: '3학년' }, { value: 'ELEMENTARY_4', label: '4학년' },
    { value: 'ELEMENTARY_5', label: '5학년' }, { value: 'ELEMENTARY_6', label: '6학년' },
  ]},
  { group: '중학교', items: [
    { value: 'MIDDLE_1', label: '1학년' }, { value: 'MIDDLE_2', label: '2학년' },
    { value: 'MIDDLE_3', label: '3학년' },
  ]},
  { group: '고등학교', items: [
    { value: 'HIGH_1', label: '1학년' }, { value: 'HIGH_2', label: '2학년' },
    { value: 'HIGH_3', label: '3학년' },
  ]},
]

const SUBJECTS = ['국어', '영어', '수학']

const GRADE_LABEL: Record<string, string> = {
  ELEMENTARY_1: '초등 1학년', ELEMENTARY_2: '초등 2학년', ELEMENTARY_3: '초등 3학년',
  ELEMENTARY_4: '초등 4학년', ELEMENTARY_5: '초등 5학년', ELEMENTARY_6: '초등 6학년',
  MIDDLE_1: '중학 1학년', MIDDLE_2: '중학 2학년', MIDDLE_3: '중학 3학년',
  HIGH_1: '고등 1학년', HIGH_2: '고등 2학년', HIGH_3: '고등 3학년',
}

// ================================================================
// 학년별 · 과목별 문제 데이터 (한국 교육과정 기반)
// 각 학년+과목 조합당 10문제씩 준비, 실행 시 랜덤으로 선택
// ================================================================
const QUESTION_BANK: Record<string, Record<string, Question[]>> = {
  // ────────── 초등학교 1학년 ──────────
  'ELEMENTARY_1': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 자음이 아닌 것은?', options:['ㄱ','ㅏ','ㅂ','ㄷ'], answer:1, explanation:'ㅏ는 모음입니다. ㄱ, ㅂ, ㄷ은 자음입니다.' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"나무"의 첫 글자 자음은?', options:['ㄴ','ㄷ','ㅁ','ㅂ'], answer:0, explanation:'"나"의 자음은 ㄴ입니다.' },
      { number:3, type:'SHORT_ANSWER', question:'"사과"에서 받침이 있는 글자를 쓰세요.', answer:'과', explanation:'"과"는 받침이 없지만, "사과"는 두 글자 모두 받침이 없습니다. 정답은 "과"입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'다음 중 모음만 모인 것은?', options:['ㅏ,ㅓ,ㅗ','ㄱ,ㅏ,ㅓ','ㅂ,ㅗ,ㅜ','ㄷ,ㅡ,ㅣ'], answer:0, explanation:'ㅏ, ㅓ, ㅗ는 모두 모음입니다.' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"엄마"의 글자 수는?', options:['1개','2개','3개','4개'], answer:1, explanation:'"엄"+"마" = 2글자입니다.' },
      { number:6, type:'SHORT_ANSWER', question:'"ㅎ"으로 시작하는 동물 이름을 하나 쓰세요.', answer:'호랑이', explanation:'호랑이, 하마, 학 등이 있습니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'받침 "ㄹ"이 들어간 글자는?', options:['가','달','나','바'], answer:1, explanation:'"달"의 받침이 ㄹ입니다.' },
      { number:8, type:'MULTIPLE_CHOICE', question:'다음 문장에서 빈칸에 들어갈 말은? "나는 학교에 ___."', options:['갑니다','예쁩니다','큽니다','작습니다'], answer:0, explanation:'학교에 "갑니다"가 자연스러운 문장입니다.' },
      { number:9, type:'SHORT_ANSWER', question:'"가나다라마바사"에서 세 번째 글자를 쓰세요.', answer:'다', explanation:'가-나-다 순서로 세 번째는 "다"입니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'다음 중 올바른 인사말은?', options:['안녕히 가세요','안녕히 갔어요','안녕히 갈게요','안녕히 간다'], answer:0, explanation:'"안녕히 가세요"가 올바른 이별 인사입니다.' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'알파벳 A 다음에 오는 글자는?', options:['C','B','D','E'], answer:1, explanation:'알파벳 순서: A-B-C-D-E' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"Apple"은 무슨 뜻인가요?', options:['바나나','사과','포도','딸기'], answer:1, explanation:'Apple은 사과라는 뜻입니다.' },
      { number:3, type:'SHORT_ANSWER', question:'"안녕하세요"를 영어로 쓰세요.', answer:'Hello', explanation:'Hello는 영어로 "안녕하세요"입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'영어로 "1"은?', options:['Two','Three','One','Four'], answer:2, explanation:'One은 숫자 1입니다.' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"Dog"는 어떤 동물인가요?', options:['고양이','강아지','새','물고기'], answer:1, explanation:'Dog는 강아지(개)입니다.' },
      { number:6, type:'MULTIPLE_CHOICE', question:'빨간색을 영어로 하면?', options:['Blue','Green','Red','Yellow'], answer:2, explanation:'Red는 빨간색입니다.' },
      { number:7, type:'SHORT_ANSWER', question:'"Cat"의 뜻을 쓰세요.', answer:'고양이', explanation:'Cat은 고양이라는 뜻입니다.' },
      { number:8, type:'MULTIPLE_CHOICE', question:'알파벳은 총 몇 개인가요?', options:['24개','25개','26개','27개'], answer:2, explanation:'영어 알파벳은 A부터 Z까지 총 26개입니다.' },
      { number:9, type:'MULTIPLE_CHOICE', question:'"Thank you"는 무슨 뜻인가요?', options:['미안해요','감사합니다','안녕하세요','잘 가요'], answer:1, explanation:'Thank you는 "감사합니다"라는 뜻입니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'"Book"은 무엇인가요?', options:['연필','공책','책','지우개'], answer:2, explanation:'Book은 책이라는 뜻입니다.' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'3 + 4 = ?', options:['5','6','7','8'], answer:2, explanation:'3 + 4 = 7입니다.' },
      { number:2, type:'SHORT_ANSWER', question:'8 - 3 = ?', answer:'5', explanation:'8에서 3을 빼면 5입니다.' },
      { number:3, type:'MULTIPLE_CHOICE', question:'5 + 5 = ?', options:['8','9','10','11'], answer:2, explanation:'5 + 5 = 10입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'9 - 4 = ?', options:['3','4','5','6'], answer:2, explanation:'9 - 4 = 5입니다.' },
      { number:5, type:'SHORT_ANSWER', question:'2 + 6 = ?', answer:'8', explanation:'2 + 6 = 8입니다.' },
      { number:6, type:'MULTIPLE_CHOICE', question:'7보다 2 큰 수는?', options:['5','8','9','10'], answer:2, explanation:'7 + 2 = 9입니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'10 - 7 = ?', options:['1','2','3','4'], answer:2, explanation:'10 - 7 = 3입니다.' },
      { number:8, type:'SHORT_ANSWER', question:'1 + 2 + 3 = ?', answer:'6', explanation:'1 + 2 = 3, 3 + 3 = 6입니다.' },
      { number:9, type:'MULTIPLE_CHOICE', question:'다음 중 가장 큰 수는?', options:['3','7','5','2'], answer:1, explanation:'7이 가장 큰 수입니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'6 + 3 = ?', options:['7','8','9','10'], answer:2, explanation:'6 + 3 = 9입니다.' },
    ],
  },

  // ────────── 초등학교 3학년 ──────────
  'ELEMENTARY_3': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 의성어는?', options:['빨갛다','멍멍','천천히','예쁘다'], answer:1, explanation:'의성어는 소리를 흉내 낸 말입니다. "멍멍"은 개 짖는 소리입니다.' },
      { number:2, type:'MULTIPLE_CHOICE', question:'문장의 끝에 찍는 것은?', options:['쉼표','마침표','물음표','느낌표'], answer:1, explanation:'평서문의 끝에는 마침표(.)를 찍습니다.' },
      { number:3, type:'SHORT_ANSWER', question:'"꽃이 활짝 피었다"에서 꾸며주는 말을 찾아 쓰세요.', answer:'활짝', explanation:'"활짝"은 "피었다"를 꾸며주는 부사입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'다음 중 의태어는?', options:['왈왈','반짝반짝','쿵쿵','꼬끼오'], answer:1, explanation:'의태어는 모양을 흉내 낸 말입니다. "반짝반짝"은 빛나는 모양입니다.' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"감사합니다"와 비슷한 말은?', options:['미안합니다','고맙습니다','안녕하세요','실례합니다'], answer:1, explanation:'"고맙습니다"는 "감사합니다"와 비슷한 뜻입니다.' },
      { number:6, type:'SHORT_ANSWER', question:'받아쓰기: "학교"의 받침을 가진 글자를 쓰세요.', answer:'학', explanation:'"학"에 받침 ㄱ이 있습니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'글의 중심 문장은 보통 어디에 있나요?', options:['문단의 처음이나 끝','글의 제목','글쓴이 이름 옆','페이지 번호 옆'], answer:0, explanation:'중심 문장은 보통 문단의 처음이나 끝에 있습니다.' },
      { number:8, type:'MULTIPLE_CHOICE', question:'다음 중 높임말이 아닌 것은?', options:['드시다','주무시다','먹다','계시다'], answer:2, explanation:'"먹다"는 높임말이 아닙니다. 높임말은 "드시다"입니다.' },
      { number:9, type:'MULTIPLE_CHOICE', question:'"나는 학생입니다"에서 주어는?', options:['나는','학생','입니다','학생입니다'], answer:0, explanation:'"나는"이 문장의 주어입니다.' },
      { number:10, type:'SHORT_ANSWER', question:'"해"의 반대말을 쓰세요.', answer:'달', explanation:'해(낮)의 반대는 달(밤)입니다.' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'"How are you?"에 대한 올바른 대답은?', options:["I'm fine","I'm sorry","Goodbye","Thank you"], answer:0, explanation:'"How are you?"는 안부를 묻는 말로 "I\'m fine"이 적절합니다.' },
      { number:2, type:'SHORT_ANSWER', question:'"Monday" 다음 요일을 영어로 쓰세요.', answer:'Tuesday', explanation:'월요일(Monday) 다음은 화요일(Tuesday)입니다.' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"I ___ a student."에 들어갈 말은?', options:['is','am','are','be'], answer:1, explanation:'주어가 I일 때 be동사는 am입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"Banana"는 무엇인가요?', options:['채소','과일','고기','빵'], answer:1, explanation:'Banana(바나나)는 과일입니다.' },
      { number:5, type:'MULTIPLE_CHOICE', question:'영어로 "3월"은?', options:['January','February','March','April'], answer:2, explanation:'March는 3월입니다.' },
      { number:6, type:'SHORT_ANSWER', question:'"She ___ a teacher." 빈칸에 들어갈 말을 쓰세요.', answer:'is', explanation:'She(그녀)에는 be동사 is를 씁니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"What is this?" "It is a ___." (연필 그림)', options:['pen','pencil','book','eraser'], answer:1, explanation:'pencil은 연필이라는 뜻입니다.' },
      { number:8, type:'MULTIPLE_CHOICE', question:'다음 중 과일이 아닌 것은?', options:['Apple','Orange','Carrot','Grape'], answer:2, explanation:'Carrot(당근)은 채소입니다.' },
      { number:9, type:'SHORT_ANSWER', question:'"Good morning"의 뜻을 쓰세요.', answer:'좋은 아침', explanation:'Good morning은 "좋은 아침" 또는 아침 인사입니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'"Five"는 숫자 몇인가요?', options:['3','4','5','6'], answer:2, explanation:'Five는 숫자 5입니다.' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'245 + 138 = ?', options:['373','383','393','363'], answer:1, explanation:'245 + 138 = 383입니다.' },
      { number:2, type:'SHORT_ANSWER', question:'500 - 267 = ?', answer:'233', explanation:'500 - 267 = 233입니다.' },
      { number:3, type:'MULTIPLE_CHOICE', question:'1/2과 같은 분수는?', options:['1/3','2/4','2/3','3/4'], answer:1, explanation:'1/2 = 2/4 (분자와 분모에 각각 2를 곱함)' },
      { number:4, type:'MULTIPLE_CHOICE', question:'6 × 7 = ?', options:['36','42','48','54'], answer:1, explanation:'6 × 7 = 42입니다.' },
      { number:5, type:'SHORT_ANSWER', question:'72 ÷ 8 = ?', answer:'9', explanation:'72 ÷ 8 = 9입니다.' },
      { number:6, type:'MULTIPLE_CHOICE', question:'다음 중 가장 큰 수는?', options:['399','401','400','398'], answer:1, explanation:'401이 가장 큰 수입니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'1km = ? m', options:['10m','100m','1000m','10000m'], answer:2, explanation:'1km = 1000m입니다.' },
      { number:8, type:'SHORT_ANSWER', question:'3 × 9 = ?', answer:'27', explanation:'3 × 9 = 27입니다.' },
      { number:9, type:'MULTIPLE_CHOICE', question:'원의 가운데 점을 무엇이라 하나요?', options:['꼭짓점','중심','반지름','지름'], answer:1, explanation:'원의 가운데 점을 중심이라 합니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'356 + 244 = ?', options:['500','600','700','800'], answer:1, explanation:'356 + 244 = 600입니다.' },
    ],
  },

  // ────────── 초등학교 5학년 ──────────
  'ELEMENTARY_5': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 "토론"에 대한 설명으로 올바른 것은?', options:['혼자 생각을 정리하는 것','찬성과 반대 의견을 주고받는 것','일기를 쓰는 것','책을 읽는 것'], answer:1, explanation:'토론은 찬성과 반대로 나뉘어 의견을 주고받는 활동입니다.' },
      { number:2, type:'SHORT_ANSWER', question:'"비유"란 무엇인지 한 줄로 설명하세요.', answer:'다른 것에 빗대어 표현하는 것', explanation:'비유는 어떤 대상을 다른 대상에 빗대어 표현하는 방법입니다.' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"하늘이 울고 있다"에서 사용된 표현법은?', options:['직유법','은유법','의인법','과장법'], answer:2, explanation:'하늘이 사람처럼 "운다"고 표현했으므로 의인법입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'뉴스 기사에서 가장 중요한 내용이 담긴 부분은?', options:['마지막 문단','제목과 첫 문단','기자의 이름','사진 설명'], answer:1, explanation:'뉴스 기사는 제목과 첫 문단에 핵심 내용을 담습니다.' },
      { number:5, type:'SHORT_ANSWER', question:'"크다"의 반의어를 쓰세요.', answer:'작다', explanation:'"크다"의 반대말은 "작다"입니다.' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"내 마음은 호수"에서 사용된 표현법은?', options:['직유법','은유법','의인법','반복법'], answer:1, explanation:'"~은 ~이다" 형태로 직접 빗댄 은유법입니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'다음 중 사실이 아닌 의견 문장은?', options:['서울은 한국의 수도이다','지구는 둥글다','이 영화가 가장 재미있다','물은 100도에서 끓는다'], answer:2, explanation:'"가장 재미있다"는 주관적 의견입니다.' },
      { number:8, type:'MULTIPLE_CHOICE', question:'글을 요약할 때 빠지면 안 되는 것은?', options:['자세한 예시','중심 내용','글쓴이의 감정','비유적 표현'], answer:1, explanation:'요약할 때는 중심 내용이 반드시 포함되어야 합니다.' },
      { number:9, type:'SHORT_ANSWER', question:'"같이"와 "까치"에서 "같이"의 올바른 띄어쓰기를 포함한 문장: "친구와 ___ 갔다"', answer:'같이', explanation:'"같이"는 "함께"라는 뜻의 부사입니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'설명문의 목적은?', options:['감동을 주기 위해','정보를 전달하기 위해','웃음을 주기 위해','설득하기 위해'], answer:1, explanation:'설명문은 독자에게 정보를 전달하는 것이 목적입니다.' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'"I ___ to school yesterday." 빈칸에 들어갈 말은?', options:['go','goes','went','going'], answer:2, explanation:'yesterday(어제)이므로 과거시제 went를 씁니다.' },
      { number:2, type:'SHORT_ANSWER', question:'"She played soccer." 를 의문문으로 바꾸세요.', answer:'Did she play soccer?', explanation:'과거시제 의문문은 "Did + 주어 + 동사원형?"으로 만듭니다.' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"Where are you from?"의 뜻은?', options:['이름이 뭐예요?','어디 출신이에요?','몇 살이에요?','뭘 좋아해요?'], answer:1, explanation:'"Where are you from?"은 출신지를 묻는 표현입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'다음 중 과거형이 불규칙인 동사는?', options:['played','walked','ate','talked'], answer:2, explanation:'eat의 과거형은 ate로 불규칙 변화합니다.' },
      { number:5, type:'SHORT_ANSWER', question:'"나는 매일 아침 7시에 일어난다"를 영어로 쓰세요.', answer:'I get up at 7 every morning', explanation:'일상적인 행동은 현재시제로 표현합니다.' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"Can I help you?"의 뜻은?', options:['도와줄까요?','가도 될까요?','앉아도 될까요?','먹어도 될까요?'], answer:0, explanation:'"Can I help you?"는 "도와줄까요?"라는 뜻입니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"There ___ three cats." 빈칸에 들어갈 말은?', options:['is','are','am','be'], answer:1, explanation:'cats이 복수이므로 are를 씁니다.' },
      { number:8, type:'SHORT_ANSWER', question:'"beautiful"의 뜻을 쓰세요.', answer:'아름다운', explanation:'beautiful은 "아름다운"이라는 뜻의 형용사입니다.' },
      { number:9, type:'MULTIPLE_CHOICE', question:'"What time is it?" "It\'s ___." (3:30)', options:['three thirty','thirty three','three thirteen','three three'], answer:0, explanation:'3시 30분은 "three thirty"입니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'"May I sit here?"는 어떤 상황에서 쓰나요?', options:['자리에 앉아도 되는지 물을 때','음식을 주문할 때','이름을 물을 때','길을 물을 때'], answer:0, explanation:'"May I sit here?"는 자리에 앉아도 되는지 허락을 구하는 표현입니다.' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'24와 36의 최대공약수는?', options:['6','8','12','18'], answer:2, explanation:'24 = 2³×3, 36 = 2²×3² → 최대공약수 = 2²×3 = 12' },
      { number:2, type:'SHORT_ANSWER', question:'4와 6의 최소공배수는?', answer:'12', explanation:'4의 배수: 4,8,12... / 6의 배수: 6,12... → 최소공배수 = 12' },
      { number:3, type:'MULTIPLE_CHOICE', question:'2/3 + 1/6 = ?', options:['3/6','3/9','5/6','1/2'], answer:2, explanation:'2/3 = 4/6이므로 4/6 + 1/6 = 5/6' },
      { number:4, type:'MULTIPLE_CHOICE', question:'직육면체의 면의 수는?', options:['4개','5개','6개','8개'], answer:2, explanation:'직육면체는 6개의 면을 가집니다.' },
      { number:5, type:'SHORT_ANSWER', question:'3/4 - 1/2 = ?', answer:'1/4', explanation:'1/2 = 2/4이므로 3/4 - 2/4 = 1/4' },
      { number:6, type:'MULTIPLE_CHOICE', question:'25 × 4 × 8 을 가장 쉽게 계산하는 방법은?', options:['25×4=100, 100×8=800','25×8=200, 200×4=800','4×8=32, 32×25=800','모두 같다'], answer:3, explanation:'어떤 순서로 곱해도 결과는 800으로 같습니다(곱셈의 교환·결합법칙).' },
      { number:7, type:'MULTIPLE_CHOICE', question:'15의 약수가 아닌 것은?', options:['1','3','5','10'], answer:3, explanation:'15 = 1×15 = 3×5 → 약수: 1,3,5,15. 10은 약수가 아닙니다.' },
      { number:8, type:'SHORT_ANSWER', question:'혼합 계산: 3 + 4 × 2 = ?', answer:'11', explanation:'곱셈을 먼저 계산: 4×2=8, 3+8=11' },
      { number:9, type:'MULTIPLE_CHOICE', question:'정육면체의 모서리 수는?', options:['6개','8개','10개','12개'], answer:3, explanation:'정육면체는 12개의 모서리를 가집니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'1/2 × 3/4 = ?', options:['3/8','4/6','3/6','4/8'], answer:0, explanation:'분수의 곱셈: (1×3)/(2×4) = 3/8' },
    ],
  },

  // ────────── 중학교 1학년 ──────────
  'MIDDLE_1': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'소설의 3요소가 아닌 것은?', options:['인물','사건','배경','운율'], answer:3, explanation:'소설의 3요소는 인물, 사건, 배경입니다. 운율은 시의 요소입니다.' },
      { number:2, type:'MULTIPLE_CHOICE', question:'시에서 말하는 이를 무엇이라 하나요?', options:['작가','시적 화자','주인공','서술자'], answer:1, explanation:'시에서 말하는 이를 시적 화자(시의 나)라고 합니다.' },
      { number:3, type:'SHORT_ANSWER', question:'"배가 부르다"와 "배를 타다"에서 "배"처럼 소리는 같지만 뜻이 다른 말을 무엇이라 하나요?', answer:'동음이의어', explanation:'소리는 같지만 뜻이 다른 단어를 동음이의어라 합니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'다음 중 설명문의 특징은?', options:['감정을 표현한다','사실과 정보를 전달한다','주장을 내세운다','이야기를 들려준다'], answer:1, explanation:'설명문은 객관적 사실과 정보를 전달하는 글입니다.' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"내 마음은 바다처럼 넓다"에서 사용된 비유법은?', options:['직유법','은유법','의인법','과장법'], answer:0, explanation:'"~처럼"을 사용하여 비유했으므로 직유법입니다.' },
      { number:6, type:'SHORT_ANSWER', question:'글에서 핵심 내용을 담고 있는 문장을 무엇이라 하나요?', answer:'주제문', explanation:'주제문(중심문장)은 글의 핵심 내용을 담은 문장입니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'소설에서 사건이 전개되는 순서는?', options:['발단-위기-절정-결말','발단-전개-위기-절정-결말','시작-중간-끝','기-승-전-결'], answer:3, explanation:'소설의 구성은 기(발단)-승(전개)-전(절정)-결(결말)입니다.' },
      { number:8, type:'MULTIPLE_CHOICE', question:'다음 중 높임 표현이 잘못된 것은?', options:['선생님께서 오셨다','할머니가 밥을 먹었다','아버지께서 주무신다','어머니께 드렸다'], answer:1, explanation:'"할머니가 밥을 먹었다" → "할머니께서 진지를 잡수셨다"가 올바른 높임입니다.' },
      { number:9, type:'SHORT_ANSWER', question:'"흐르는 세월"에서 사용된 표현법은 무엇인가요?', answer:'의인법', explanation:'세월은 사람이 아니지만 "흐른다"라는 동작을 부여했으므로 의인법입니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'논설문의 구성 요소가 아닌 것은?', options:['서론','본론','결론','줄거리'], answer:3, explanation:'논설문은 서론-본론-결론으로 구성됩니다. 줄거리는 소설의 요소입니다.' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'"She ___ English every day."', options:['study','studies','studied','studying'], answer:1, explanation:'주어가 She(3인칭 단수)이고 every day(현재)이므로 studies' },
      { number:2, type:'SHORT_ANSWER', question:'"I don\'t like coffee."를 긍정문으로 바꾸세요.', answer:'I like coffee.', explanation:'부정문에서 don\'t를 빼면 긍정문이 됩니다.' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"There is ___ apple on the table."', options:['a','an','the','some'], answer:1, explanation:'apple은 모음으로 시작하므로 an을 씁니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"What does she do?" 이 문장은 무엇을 묻나요?', options:['나이','직업','이름','출신'], answer:1, explanation:'"What does she do?"는 직업을 묻는 표현입니다.' },
      { number:5, type:'SHORT_ANSWER', question:'"He can swim."을 부정문으로 바꾸세요.', answer:"He can't swim.", explanation:'can의 부정은 can\'t(cannot)입니다.' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"I ___ to the park yesterday."', options:['go','went','goes','gone'], answer:1, explanation:'yesterday이므로 과거시제 went를 씁니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'다음 중 복수형이 잘못된 것은?', options:['dogs','children','boxs','cities'], answer:2, explanation:'box의 올바른 복수형은 boxes입니다.' },
      { number:8, type:'SHORT_ANSWER', question:'"important"의 뜻을 쓰세요.', answer:'중요한', explanation:'important는 "중요한"이라는 뜻의 형용사입니다.' },
      { number:9, type:'MULTIPLE_CHOICE', question:'"My mother ___ dinner now."', options:['cook','cooks','is cooking','cooked'], answer:2, explanation:'now(지금)이므로 현재진행형 is cooking을 씁니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'"Which"의 뜻은?', options:['언제','어디','어느 것','왜'], answer:2, explanation:'which는 "어느 것"이라는 뜻의 의문사입니다.' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'(-3) + (-5) = ?', options:['2','8','-2','-8'], answer:3, explanation:'음수끼리의 덧셈: (-3)+(-5) = -(3+5) = -8' },
      { number:2, type:'SHORT_ANSWER', question:'(-4) × (-6) = ?', answer:'24', explanation:'음수 × 음수 = 양수: (-4)×(-6) = 24' },
      { number:3, type:'MULTIPLE_CHOICE', question:'일차방정식 2x + 3 = 11의 해는?', options:['x=3','x=4','x=5','x=7'], answer:1, explanation:'2x+3=11 → 2x=8 → x=4' },
      { number:4, type:'MULTIPLE_CHOICE', question:'다음 중 유리수가 아닌 것은?', options:['1/2','0.333...','√2','3'], answer:2, explanation:'√2는 무리수입니다. 분수로 표현할 수 없습니다.' },
      { number:5, type:'SHORT_ANSWER', question:'좌표평면에서 점 (3, -2)는 제 몇 사분면에 있나요?', answer:'4', explanation:'x>0, y<0이면 제4사분면입니다.' },
      { number:6, type:'MULTIPLE_CHOICE', question:'(-2)³ = ?', options:['6','8','-6','-8'], answer:3, explanation:'(-2)³ = (-2)×(-2)×(-2) = 4×(-2) = -8' },
      { number:7, type:'MULTIPLE_CHOICE', question:'3x - 7 = 2x + 5의 해는?', options:['x=10','x=11','x=12','x=13'], answer:2, explanation:'3x-2x = 5+7 → x = 12' },
      { number:8, type:'SHORT_ANSWER', question:'절댓값 |-7| = ?', answer:'7', explanation:'절댓값은 수직선에서 원점까지의 거리로, 항상 0 이상입니다.' },
      { number:9, type:'MULTIPLE_CHOICE', question:'다음 중 정비례 관계인 것은?', options:['y = 2x','y = x + 3','y = x²','y = 6/x'], answer:0, explanation:'y = ax(a≠0) 형태가 정비례입니다. y=2x가 해당됩니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'18/24를 기약분수로 나타내면?', options:['9/12','6/8','3/4','2/3'], answer:2, explanation:'18과 24의 최대공약수는 6. 18÷6=3, 24÷6=4 → 3/4' },
    ],
  },

  // ────────── 중학교 3학년 ──────────
  'MIDDLE_3': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 고전시가의 갈래가 아닌 것은?', options:['향가','시조','가사','자유시'], answer:3, explanation:'자유시는 현대시의 갈래입니다.' },
      { number:2, type:'MULTIPLE_CHOICE', question:'논증에서 일반적 원리에서 특수한 결론을 이끌어내는 방법은?', options:['귀납법','연역법','유추','변증법'], answer:1, explanation:'연역법은 일반적 전제에서 특수한 결론을 도출하는 논증법입니다.' },
      { number:3, type:'SHORT_ANSWER', question:'시조의 형식에서 "초장-중장-종장"의 총 글자 수 기준은 약 몇 자인가요?', answer:'45', explanation:'시조는 초장·중장·종장 각 15자 내외, 총 약 45자입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"춘향전"의 갈래는?', options:['판소리계 소설','역사 소설','과학 소설','추리 소설'], answer:0, explanation:'춘향전은 판소리에서 유래한 판소리계 소설입니다.' },
      { number:5, type:'MULTIPLE_CHOICE', question:'다음 중 "주장하는 글"의 구성으로 올바른 것은?', options:['처음-중간-끝','기-승-전-결','서론-본론-결론','발단-전개-절정-결말'], answer:2, explanation:'주장하는 글(논설문)은 서론-본론-결론으로 구성됩니다.' },
      { number:6, type:'SHORT_ANSWER', question:'문학에서 작가가 직접 말하지 않고 반대로 표현하여 의미를 강조하는 것을 무엇이라 하나요?', answer:'반어법', explanation:'반어법(아이러니)은 실제 의미와 반대로 표현하는 수사법입니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'다음 중 수필의 특징이 아닌 것은?', options:['자유로운 형식','개인적 경험','허구적 사건','솔직한 고백'], answer:2, explanation:'수필은 실제 경험을 바탕으로 쓴 글이므로 허구적 사건은 특징이 아닙니다.' },
      { number:8, type:'MULTIPLE_CHOICE', question:'"서울의 지하철은 편리하다. 그러나 출퇴근 시간에는 매우 혼잡하다."에서 접속어의 역할은?', options:['나열','인과','전환(대조)','보충'], answer:2, explanation:'"그러나"는 앞뒤 내용을 대조하는 전환의 접속어입니다.' },
      { number:9, type:'SHORT_ANSWER', question:'고려가요의 특징 중 하나인, 여러 연이 반복되는 형식을 무엇이라 하나요?', answer:'분연체', explanation:'분연체는 여러 연(절)으로 나뉘어 반복되는 구조입니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'다음 중 희곡의 구성요소가 아닌 것은?', options:['대사','지문','해설','서술'], answer:3, explanation:'희곡은 대사, 지문, 해설로 구성됩니다. 서술은 소설의 요소입니다.' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'"The book ___ by many students." 수동태 빈칸은?', options:['read','reads','is read','reading'], answer:2, explanation:'수동태는 "be + 과거분사"입니다. is read가 맞습니다.' },
      { number:2, type:'SHORT_ANSWER', question:'"If it rains tomorrow, I ___ stay home." 빈칸에 들어갈 말은?', answer:'will', explanation:'조건절(if절)이 현재시제면, 주절은 will+동사원형입니다.' },
      { number:3, type:'MULTIPLE_CHOICE', question:'관계대명사 who를 쓸 수 있는 경우는?', options:['사물을 수식할 때','사람을 수식할 때','장소를 수식할 때','시간을 수식할 때'], answer:1, explanation:'who는 사람을 수식하는 관계대명사입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"I have lived here ___ 2010."', options:['for','since','during','while'], answer:1, explanation:'특정 시점(2010) 앞에는 since를 씁니다.' },
      { number:5, type:'SHORT_ANSWER', question:'"She is taller than me."를 원급 비교(as~as)로 바꾸세요.', answer:'I am not as tall as she.', explanation:'비교급의 반대는 "not as ~ as"로 표현합니다.' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"I wish I ___ a bird." 빈칸에 들어갈 말은?', options:['am','was','were','be'], answer:2, explanation:'가정법에서는 be동사를 were로 씁니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"He told me ___ he was tired."', options:['what','which','that','who'], answer:2, explanation:'간접화법에서 접속사 that을 사용합니다.' },
      { number:8, type:'SHORT_ANSWER', question:'"too ~ to" 구문: "He is too young to drive."의 뜻을 쓰세요.', answer:'그는 너무 어려서 운전할 수 없다', explanation:'"too ~ to"는 "너무 ~해서 ...할 수 없다"의 뜻입니다.' },
      { number:9, type:'MULTIPLE_CHOICE', question:'"The man ___ I met yesterday was kind."의 빈칸은?', options:['who','whom','which','whose'], answer:1, explanation:'met의 목적어 역할을 하므로 목적격 관계대명사 whom을 씁니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'현재완료의 용법이 아닌 것은?', options:['경험','완료','계속','추측'], answer:3, explanation:'현재완료의 용법은 경험, 완료, 계속, 결과입니다. 추측은 아닙니다.' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'이차방정식 x²-5x+6=0의 해는?', options:['x=1, x=6','x=2, x=3','x=-2, x=-3','x=1, x=5'], answer:1, explanation:'(x-2)(x-3)=0이므로 x=2 또는 x=3' },
      { number:2, type:'SHORT_ANSWER', question:'근의 공식에서 x²+4x+3=0의 해를 구하세요 (작은 수부터).', answer:'-3, -1', explanation:'(x+3)(x+1)=0 → x=-3 또는 x=-1' },
      { number:3, type:'MULTIPLE_CHOICE', question:'이차함수 y=x²의 꼭짓점은?', options:['(0,0)','(1,1)','(0,1)','(1,0)'], answer:0, explanation:'y=x²의 꼭짓점은 원점 (0,0)입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'피타고라스 정리에서, 빗변이 5이고 한 변이 3이면 나머지 변은?', options:['2','3','4','6'], answer:2, explanation:'5²=3²+a² → 25=9+a² → a²=16 → a=4' },
      { number:5, type:'SHORT_ANSWER', question:'y=2x²-8의 x절편을 구하세요 (양수).', answer:'2', explanation:'y=0: 2x²-8=0 → x²=4 → x=±2, 양수는 2' },
      { number:6, type:'MULTIPLE_CHOICE', question:'이차방정식 x²+6x+9=0의 해는?', options:['x=3','x=-3','x=±3','x=9'], answer:1, explanation:'(x+3)²=0이므로 x=-3 (중근)' },
      { number:7, type:'MULTIPLE_CHOICE', question:'직각삼각형에서 빗변의 길이가 13, 한 변이 5일 때 나머지 변은?', options:['8','10','12','14'], answer:2, explanation:'13²=5²+a² → 169=25+a² → a²=144 → a=12' },
      { number:8, type:'SHORT_ANSWER', question:'이차함수 y=(x-1)²+3의 꼭짓점 좌표를 쓰세요.', answer:'(1, 3)', explanation:'y=(x-a)²+b의 꼭짓점은 (a, b)이므로 (1, 3)' },
      { number:9, type:'MULTIPLE_CHOICE', question:'x²-16=0의 해는?', options:['x=±2','x=±4','x=±8','x=±16'], answer:1, explanation:'x²=16 → x=±4' },
      { number:10, type:'MULTIPLE_CHOICE', question:'대각선의 개수 공식 n(n-3)/2에서, 오각형의 대각선 수는?', options:['3개','4개','5개','6개'], answer:2, explanation:'5(5-3)/2 = 5×2/2 = 5개' },
    ],
  },

  // ────────── 고등학교 1학년 ──────────
  'HIGH_1': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 "화법"에 해당하는 것은?', options:['글쓰기','발표와 토론','독서','문법 분석'], answer:1, explanation:'화법은 말하기와 듣기를 다루며, 발표와 토론이 포함됩니다.' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"봄봄" (김유정)의 서술 시점은?', options:['1인칭 관찰자','1인칭 주인공','3인칭 전지적','3인칭 관찰자'], answer:1, explanation:'"봄봄"은 "나"가 주인공으로서 이야기를 서술하는 1인칭 주인공 시점입니다.' },
      { number:3, type:'SHORT_ANSWER', question:'비문학에서 글의 전개 방식 중, 두 대상의 공통점과 차이점을 제시하는 방법을 무엇이라 하나요?', answer:'비교와 대조', explanation:'비교(공통점)와 대조(차이점)는 비문학의 대표적 전개 방식입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'다음 중 현대시에서 "심상(이미지)"의 종류가 아닌 것은?', options:['시각적 심상','청각적 심상','미각적 심상','논리적 심상'], answer:3, explanation:'심상은 감각적 이미지(시각, 청각, 미각, 후각, 촉각)를 말합니다.' },
      { number:5, type:'MULTIPLE_CHOICE', question:'다음 형태소 분석에서 "먹었다"의 형태소 개수는?', options:['1개','2개','3개','4개'], answer:2, explanation:'"먹-"(어근) + "-었-"(선어말어미) + "-다"(종결어미) = 3개' },
      { number:6, type:'SHORT_ANSWER', question:'문학의 기능 중, 독자에게 즐거움을 주는 기능을 무엇이라 하나요?', answer:'쾌락적 기능', explanation:'문학의 기능: 쾌락적 기능, 교훈적 기능, 인식적 기능 등' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"갈래"에 따른 문학 분류에서, "수필"이 속하는 갈래는?', options:['서정','서사','교술','극'], answer:2, explanation:'수필은 교술(비허구적 산문) 갈래에 속합니다.' },
      { number:8, type:'MULTIPLE_CHOICE', question:'다음 중 음운 변동의 예로 올바른 것은?', options:['"국물"→[궁물]은 비음화','"같이"→[가치]는 구개음화','"꽃잎"→[꼰닙]은 된소리되기','"밥물"→[밤물]은 유음화'], answer:0, explanation:'"국물"의 ㄱ이 비음 ㅁ 앞에서 ㅇ으로 변하는 비음화입니다.' },
      { number:9, type:'SHORT_ANSWER', question:'"윤동주"의 대표 시 "서시"의 첫 행을 쓰세요.', answer:'죽는 날까지 하늘을 우러러', explanation:'"죽는 날까지 하늘을 우러러 / 한 점 부끄럼이 없기를"' },
      { number:10, type:'MULTIPLE_CHOICE', question:'다음 중 "매체 언어"의 특성이 아닌 것은?', options:['복합 양식성','상호작용성','일방향성','즉시성'], answer:2, explanation:'매체 언어는 쌍방향적(상호작용성)이며, 일방향적이지 않습니다.' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'"If I ___ rich, I would travel the world."', options:['am','was','were','be'], answer:2, explanation:'가정법 과거에서는 be동사를 were로 씁니다.' },
      { number:2, type:'SHORT_ANSWER', question:'"She has been studying for 3 hours."의 시제를 쓰세요.', answer:'현재완료진행', explanation:'has/have been ~ing는 현재완료진행형입니다.' },
      { number:3, type:'MULTIPLE_CHOICE', question:'관계부사 "where"을 쓸 수 있는 선행사는?', options:['시간','장소','이유','방법'], answer:1, explanation:'where는 장소를 나타내는 선행사 뒤에 씁니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"Not only A but also B"의 뜻은?', options:['A뿐만 아니라 B도','A가 아니라 B','A 또는 B','A와 B 둘 다 아닌'], answer:0, explanation:'"not only A but also B"는 "A뿐만 아니라 B도"라는 뜻입니다.' },
      { number:5, type:'SHORT_ANSWER', question:'"It is important that he ___ (study) hard." 가정법 현재에서 빈칸을 쓰세요.', answer:'study', explanation:'가정법 현재: that절에서 동사원형을 씁니다.' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"The building ___ in 1990."', options:['built','was built','is built','has built'], answer:1, explanation:'건물이 지어진 것(수동)이고 과거(1990)이므로 was built' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"분사구문"이란?', options:['명사를 수식하는 구문','부사절을 줄인 구문','형용사를 강조하는 구문','의문문을 만드는 구문'], answer:1, explanation:'분사구문은 접속사+주어를 생략하고 동사를 분사로 바꾼 부사절 축약 구문입니다.' },
      { number:8, type:'SHORT_ANSWER', question:'"강조 구문: It is ~ that ..."에서 "I met Tom yesterday."의 Tom을 강조하세요.', answer:'It is Tom that I met yesterday.', explanation:'강조할 부분을 It is/was와 that 사이에 넣습니다.' },
      { number:9, type:'MULTIPLE_CHOICE', question:'"I regret ___ that." (과거의 행동을 후회)', options:['say','to say','saying','said'], answer:2, explanation:'regret + ~ing는 과거에 한 일을 후회할 때 씁니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'5형식 문장 "I found the book interesting."에서 interesting의 역할은?', options:['주어','목적어','목적격 보어','부사'], answer:2, explanation:'5형식: S+V+O+OC에서 interesting은 목적격 보어입니다.' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'(x+2)(x-3)을 전개하면?', options:['x²-x-6','x²+x-6','x²-x+6','x²+x+6'], answer:0, explanation:'(x+2)(x-3) = x²-3x+2x-6 = x²-x-6' },
      { number:2, type:'SHORT_ANSWER', question:'x²+5x+6을 인수분해하세요.', answer:'(x+2)(x+3)', explanation:'합이 5, 곱이 6인 두 수는 2와 3 → (x+2)(x+3)' },
      { number:3, type:'MULTIPLE_CHOICE', question:'이차부등식 x²-4 < 0의 해는?', options:['x<-2 또는 x>2','-2<x<2','x<2','x>-2'], answer:1, explanation:'(x-2)(x+2)<0이므로 -2<x<2' },
      { number:4, type:'MULTIPLE_CHOICE', question:'함수 f(x)=2x+1에서 f(3)의 값은?', options:['5','6','7','8'], answer:2, explanation:'f(3) = 2(3)+1 = 7' },
      { number:5, type:'SHORT_ANSWER', question:'|x-3| = 5의 해를 모두 구하세요 (작은 수부터).', answer:'-2, 8', explanation:'x-3=5 → x=8, x-3=-5 → x=-2' },
      { number:6, type:'MULTIPLE_CHOICE', question:'다항식 x³+x²-2x를 인수분해하면?', options:['x(x+2)(x-1)','x(x-2)(x+1)','x(x²-2)','(x+1)(x²-2x)'], answer:0, explanation:'x³+x²-2x = x(x²+x-2) = x(x+2)(x-1)' },
      { number:7, type:'MULTIPLE_CHOICE', question:'나머지 정리: f(x)=x²+3x-4를 (x-1)로 나눈 나머지는?', options:['-4','0','2','4'], answer:1, explanation:'f(1) = 1+3-4 = 0. 나머지는 0 (x-1은 인수)' },
      { number:8, type:'SHORT_ANSWER', question:'집합 A={1,2,3,4}, B={3,4,5,6}일 때, A∩B를 구하세요.', answer:'{3, 4}', explanation:'A∩B는 두 집합의 공통 원소: {3, 4}' },
      { number:9, type:'MULTIPLE_CHOICE', question:'log₂8 = ?', options:['2','3','4','8'], answer:1, explanation:'2³=8이므로 log₂8 = 3' },
      { number:10, type:'MULTIPLE_CHOICE', question:'이차방정식 x²-6x+k=0이 중근을 가지려면 k는?', options:['6','8','9','12'], answer:2, explanation:'판별식 D=36-4k=0 → k=9' },
    ],
  },

  // ────────── 고등학교 3학년 ──────────
  'HIGH_3': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'수능 국어에서 "화작문"이 의미하는 것은?', options:['화법과 작문','화학과 문학','화법과 문법','화학과 문법'], answer:0, explanation:'화작문은 화법과 작문의 줄임말입니다.' },
      { number:2, type:'MULTIPLE_CHOICE', question:'비문학 지문에서 "역접" 관계를 나타내는 접속어는?', options:['그리고','따라서','하지만','예를 들어'], answer:2, explanation:'"하지만"은 앞뒤 내용이 반대(역접)임을 나타냅니다.' },
      { number:3, type:'SHORT_ANSWER', question:'수능 문학에서 외적 준거에 의한 감상이란 무엇인가요?', answer:'작품 외부의 사회 역사적 맥락으로 감상하는 것', explanation:'외적 준거: 작가론, 반영론, 수용론 등 작품 외부 맥락을 활용한 감상' },
      { number:4, type:'MULTIPLE_CHOICE', question:'다음 중 "음운의 축약"에 해당하는 것은?', options:['놓다→[노타]','국물→[궁물]','굳이→[구지]','좋다→[조타]'], answer:3, explanation:'"좋다"에서 ㅎ+ㄷ→ㅌ로 축약(거센소리되기)됩니다.' },
      { number:5, type:'MULTIPLE_CHOICE', question:'고전소설 "홍길동전"의 작가는?', options:['김시습','허균','박지원','정약용'], answer:1, explanation:'"홍길동전"은 허균이 지은 최초의 한글 소설입니다.' },
      { number:6, type:'SHORT_ANSWER', question:'수능 비문학에서 핵심 독해 전략 중, 문단별 중심 내용을 정리하는 방법을 무엇이라 하나요?', answer:'문단 요약', explanation:'문단별 중심 내용을 요약하며 읽는 것이 비문학의 핵심 독해 전략입니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"사미인곡"의 작가는?', options:['윤선도','정철','이황','송강'], answer:1, explanation:'"사미인곡"은 정철(호: 송강)의 가사 작품입니다.' },
      { number:8, type:'MULTIPLE_CHOICE', question:'수능 언어(문법)에서 "형태소"의 정의는?', options:['뜻을 가진 가장 작은 단위','소리의 최소 단위','문장의 최소 단위','단어의 최소 단위'], answer:0, explanation:'형태소는 뜻을 가진 가장 작은 언어 단위입니다.' },
      { number:9, type:'SHORT_ANSWER', question:'김소월의 "진달래꽃"에서 화자의 정서를 한 단어로 표현하세요.', answer:'이별', explanation:'"진달래꽃"은 임과의 이별을 노래한 시입니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'수능 독서에서 "추론적 읽기"란?', options:['글에 직접 나타난 정보만 파악','글에 나타나지 않은 내용을 짐작','글의 형식만 분석','글의 오류를 찾는 것'], answer:1, explanation:'추론적 읽기는 직접 드러나지 않은 내용을 문맥에서 짐작하는 것입니다.' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'수능 영어 빈칸추론에서 가장 중요한 전략은?', options:['문법 분석','단어 암기','문맥 파악','속도 높이기'], answer:2, explanation:'빈칸추론은 문맥(앞뒤 관계)을 파악하는 것이 핵심입니다.' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"Had I known the truth, I would have acted differently." 이 문장의 시제는?', options:['가정법 과거','가정법 과거완료','가정법 미래','가정법 현재'], answer:1, explanation:'Had+주어+p.p.는 가정법 과거완료의 도치 형태입니다.' },
      { number:3, type:'SHORT_ANSWER', question:'"It goes without saying that ~"의 뜻을 쓰세요.', answer:'~은 말할 것도 없다', explanation:'"It goes without saying that ~"는 "~은 말할 필요도 없다"라는 뜻의 관용 표현입니다.' },
      { number:4, type:'MULTIPLE_CHOICE', question:'수능 영어 문장 삽입 문제의 핵심 단서는?', options:['문장의 길이','지시어와 연결어','단어의 난이도','문법 구조'], answer:1, explanation:'문장 삽입 문제는 지시어(this, such)와 연결어(however, therefore)가 핵심 단서입니다.' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"전체적으로"라는 뜻의 영어 표현은?', options:['in particular','on the whole','for instance','by contrast'], answer:1, explanation:'"on the whole"은 "전체적으로, 대체로"라는 뜻입니다.' },
      { number:6, type:'SHORT_ANSWER', question:'"The more you practice, the better you become."의 문법 구조 이름을 쓰세요.', answer:'the 비교급 the 비교급', explanation:'"the+비교급~, the+비교급~"은 "~할수록 더 ~하다" 구문입니다.' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"무관한 문장 찾기" 유형에서 핵심 전략은?', options:['가장 긴 문장 선택','주제와 관련 없는 문장 찾기','첫 번째 문장 선택','마지막 문장 선택'], answer:1, explanation:'글의 주제와 관련 없는 문장(흐름에서 벗어난 문장)을 찾습니다.' },
      { number:8, type:'MULTIPLE_CHOICE', question:'"A is to B what C is to D"의 뜻은?', options:['A는 B보다 크다','A와 B의 관계는 C와 D의 관계와 같다','A는 B가 아니라 C이다','A와 D는 같다'], answer:1, explanation:'"A:B = C:D" 관계를 나타내는 비례 표현입니다.' },
      { number:9, type:'SHORT_ANSWER', question:'"regardless of"의 뜻을 쓰세요.', answer:'~에 관계없이', explanation:'"regardless of"는 "~에 관계없이, ~에 상관없이"라는 뜻입니다.' },
      { number:10, type:'MULTIPLE_CHOICE', question:'수능 영어에서 "요지 파악" 문제의 정답 위치는 주로?', options:['글의 처음과 끝','글의 가운데만','글의 마지막 문장만','규칙이 없다'], answer:0, explanation:'요지(주제)는 대체로 글의 처음이나 끝부분에 나타납니다.' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'lim(x→0) sinx/x = ?', options:['0','1','∞','존재하지 않음'], answer:1, explanation:'삼각함수의 극한: lim(x→0) sinx/x = 1 (중요한 극한값)' },
      { number:2, type:'SHORT_ANSWER', question:'f(x) = x³ - 3x + 2 일 때 f\'(x)를 구하세요.', answer:'3x²-3', explanation:'미분: (x³)\' = 3x², (-3x)\' = -3, (2)\' = 0 → f\'(x) = 3x²-3' },
      { number:3, type:'MULTIPLE_CHOICE', question:'∫(2x+1)dx = ?', options:['x²+x+C','2x²+x+C','x²+C','2x+C'], answer:0, explanation:'∫2xdx = x², ∫1dx = x → x²+x+C' },
      { number:4, type:'MULTIPLE_CHOICE', question:'등차수열 2, 5, 8, 11, ...의 제20항은?', options:['56','59','62','65'], answer:1, explanation:'a₁=2, d=3 → a₂₀ = 2+(20-1)×3 = 2+57 = 59' },
      { number:5, type:'SHORT_ANSWER', question:'10명에서 3명을 뽑는 조합 ₁₀C₃ = ?', answer:'120', explanation:'₁₀C₃ = 10!/(3!×7!) = (10×9×8)/(3×2×1) = 120' },
      { number:6, type:'MULTIPLE_CHOICE', question:'f(x)=x²-4x+3의 최솟값은?', options:['-1','0','1','3'], answer:0, explanation:'f(x)=(x-2)²-1이므로 최솟값은 -1 (x=2일 때)' },
      { number:7, type:'MULTIPLE_CHOICE', question:'정적분 ∫₀²(2x)dx = ?', options:['2','4','6','8'], answer:1, explanation:'∫₀²(2x)dx = [x²]₀² = 4-0 = 4' },
      { number:8, type:'SHORT_ANSWER', question:'등비수열 2, 6, 18, 54, ...의 공비를 구하세요.', answer:'3', explanation:'공비 r = 6/2 = 3' },
      { number:9, type:'MULTIPLE_CHOICE', question:'5개 숫자 1,2,3,4,5로 만들 수 있는 3자리 수의 개수는? (중복 허용 안함)', options:['30','60','120','125'], answer:1, explanation:'₅P₃ = 5×4×3 = 60' },
      { number:10, type:'MULTIPLE_CHOICE', question:'함수 f(x)=x³-3x가 극대가 되는 x값은?', options:['x=-1','x=0','x=1','x=3'], answer:0, explanation:"f'(x)=3x²-3=0 → x=±1. f''(-1)=-6<0이므로 x=-1에서 극대" },
    ],
  },
}

// 데이터가 없는 학년은 가장 가까운 학년의 문제를 사용
function getQuestions(grade: string, subject: string): Question[] {
  if (QUESTION_BANK[grade]?.[subject]) return QUESTION_BANK[grade][subject]

  // fallback: 같은 학교급의 가장 가까운 학년 찾기
  const prefix = grade.split('_')[0]
  const num = parseInt(grade.split('_')[1])
  const candidates = Object.keys(QUESTION_BANK).filter(k => k.startsWith(prefix))
  if (candidates.length > 0) {
    candidates.sort((a, b) => Math.abs(parseInt(a.split('_')[1]) - num) - Math.abs(parseInt(b.split('_')[1]) - num))
    const fallback = candidates[0]
    if (QUESTION_BANK[fallback]?.[subject]) return QUESTION_BANK[fallback][subject]
  }

  // 최종 fallback
  const allGrades = Object.keys(QUESTION_BANK)
  for (const g of allGrades) {
    if (QUESTION_BANK[g][subject]) return QUESTION_BANK[g][subject]
  }
  return []
}

// 배열 셔플 (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ================================================================
// 메인 컴포넌트
// ================================================================
export default function GradeQuizPage() {
  const { user } = useAuthStore()

  const [grade, setGrade] = useState(user?.grade || '')
  const [subject, setSubject] = useState('수학')
  const [questionCount, setQuestionCount] = useState(5)
  const [phase, setPhase] = useState<Phase>('setup')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [score, setScore] = useState(0)

  // 타이머
  const handleSubmit = useCallback(() => {
    let correct = 0
    questions.forEach((q, idx) => {
      const myAnswer = answers[idx]
      if (myAnswer === undefined) return
      if (q.type === 'MULTIPLE_CHOICE') {
        if (Number(myAnswer) === Number(q.answer)) correct++
      } else {
        if (String(myAnswer).trim().toLowerCase() === String(q.answer).trim().toLowerCase()) correct++
      }
    })
    setScore(correct)
    setPhase('result')
  }, [questions, answers])

  useEffect(() => {
    if (phase !== 'quiz' || remainingSeconds <= 0) return
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) { handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase, remainingSeconds, handleSubmit])

  // 퀴즈 생성
  const handleGenerate = () => {
    if (!grade) { toast.error('학년을 선택해주세요'); return }
    setPhase('loading')

    // 약간의 딜레이로 자연스러운 생성 느낌
    setTimeout(() => {
      const pool = getQuestions(grade, subject)
      if (pool.length === 0) {
        toast.error('해당 학년/과목의 문제가 없습니다')
        setPhase('setup')
        return
      }
      const selected = shuffle(pool).slice(0, Math.min(questionCount, pool.length))
        .map((q, i) => ({ ...q, number: i + 1 }))
      setQuestions(selected)
      setAnswers({})
      setRemainingSeconds(selected.length * 120)
      setPhase('quiz')
      toast.success(`${selected.length}문제가 생성되었습니다!`)
    }, 1500)
  }

  const handleReset = () => { setQuestions([]); setAnswers({}); setScore(0); setPhase('setup') }
  const formatTime = (sec: number) => `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`
  const answeredCount = Object.keys(answers).length
  const percent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  // ====== 설정 화면 ======
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">AI 학년별 퀴즈</h1>
          <p className="text-sm text-gray-500 mt-1">학년과 과목을 선택하면 맞춤 퀴즈를 만들어줍니다</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">학년 선택</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm ${!grade ? 'text-gray-400' : 'text-gray-900'}`}>
              <option value="">학년을 선택하세요</option>
              {GRADE_OPTIONS.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((item) => (
                    <option key={item.value} value={item.value}>{g.group} {item.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">과목</label>
            <div className="flex gap-3">
              {SUBJECTS.map((s) => (
                <button key={s} onClick={() => setSubject(s)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition border ${
                    subject === s
                      ? s === '국어' ? 'bg-red-50 text-red-600 border-red-300'
                        : s === '영어' ? 'bg-green-50 text-green-600 border-green-300'
                        : 'bg-blue-50 text-blue-600 border-blue-300'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">문제 수: <span className="text-primary-600">{questionCount}문제</span></label>
            <input type="range" min={3} max={10} value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full accent-primary-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>3문제</span><span>10문제</span></div>
          </div>
          <button onClick={handleGenerate} disabled={!grade}
            className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm">
            퀴즈 시작하기
          </button>
        </div>
      </div>
    )
  }

  // ====== 로딩 ======
  if (phase === 'loading') {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">퀴즈를 만들고 있어요...</h2>
        <p className="text-gray-500 text-sm">{GRADE_LABEL[grade]} {subject} · {questionCount}문제</p>
      </div>
    )
  }

  // ====== 결과 ======
  if (phase === 'result') {
    const emoji = percent >= 80 ? '🎉' : percent >= 60 ? '👏' : '💪'
    const message = percent >= 80 ? '훌륭합니다!' : percent >= 60 ? '잘 했어요!' : '다시 도전해보세요!'
    const color = percent >= 80 ? 'text-green-600' : percent >= 60 ? 'text-yellow-600' : 'text-red-500'

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6">
          <div className="text-5xl mb-3">{emoji}</div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{message}</h2>
          <p className="text-sm text-gray-500 mb-4">{GRADE_LABEL[grade]} {subject} 퀴즈 결과</p>
          <div className={`text-5xl font-extrabold ${color} mb-2`}>{percent}점</div>
          <p className="text-gray-500">{questions.length}문제 중 {score}문제 정답</p>
        </div>
        <div className="space-y-4 mb-6">
          {questions.map((q, idx) => {
            const myAnswer = answers[idx]
            const isCorrect = q.type === 'MULTIPLE_CHOICE'
              ? Number(myAnswer) === Number(q.answer)
              : String(myAnswer || '').trim().toLowerCase() === String(q.answer).trim().toLowerCase()
            return (
              <div key={idx} className={`bg-white rounded-xl p-5 border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-400'}`}>
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-400'}`}>
                    {isCorrect ? 'O' : 'X'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-2">Q{q.number}. {q.question}</p>
                    {q.type === 'MULTIPLE_CHOICE' && q.options && (
                      <div className="space-y-1 mb-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`text-sm px-3 py-1.5 rounded-lg ${
                            oi === Number(q.answer) ? 'bg-green-50 text-green-700 font-medium' :
                            oi === Number(myAnswer) && !isCorrect ? 'bg-red-50 text-red-600 line-through' : 'text-gray-500'
                          }`}>{String.fromCharCode(9312 + oi)} {opt}</div>
                        ))}
                      </div>
                    )}
                    {q.type === 'SHORT_ANSWER' && (
                      <div className="text-sm mb-2">
                        <span className="text-gray-500">내 답: </span>
                        <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-500 line-through'}>{String(myAnswer || '미답변')}</span>
                        {!isCorrect && <span className="text-green-600 font-medium ml-2">정답: {String(q.answer)}</span>}
                      </div>
                    )}
                    <div className="bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded-lg">💡 {q.explanation}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition text-sm">새 퀴즈 만들기</button>
          <button onClick={handleGenerate} className="flex-1 py-3 bg-white text-gray-700 border rounded-xl font-semibold hover:bg-gray-50 transition text-sm">같은 설정으로 다시</button>
        </div>
      </div>
    )
  }

  // ====== 퀴즈 풀기 ======
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between sticky top-20 z-10">
        <div>
          <p className="text-sm font-semibold text-gray-800">{GRADE_LABEL[grade]} · {subject}</p>
          <p className="text-xs text-gray-400">{answeredCount}/{questions.length} 문제 응답 완료</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
            <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
          </div>
          <div className={`text-lg font-mono font-bold px-3 py-1 rounded-lg ${
            remainingSeconds <= 60 ? 'bg-red-100 text-red-600 animate-pulse' :
            remainingSeconds <= 300 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
          }`}>{formatTime(remainingSeconds)}</div>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start gap-3 mb-3">
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                answers[idx] !== undefined ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'
              }`}>{q.number}</span>
              <div className="flex-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  q.type === 'MULTIPLE_CHOICE' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                }`}>{q.type === 'MULTIPLE_CHOICE' ? '객관식' : '주관식'}</span>
                <p className="font-medium text-gray-800 mt-1">{q.question}</p>
              </div>
            </div>
            {q.type === 'MULTIPLE_CHOICE' && q.options && (
              <div className="space-y-2 ml-11">
                {q.options.map((opt, oi) => (
                  <label key={oi} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition border ${
                    Number(answers[idx]) === oi ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700'
                  }`}>
                    <input type="radio" name={`q-${idx}`} checked={Number(answers[idx]) === oi}
                      onChange={() => setAnswers({ ...answers, [idx]: oi })} className="accent-primary-600" />
                    <span className="text-sm">{String.fromCharCode(9312 + oi)} {opt}</span>
                  </label>
                ))}
              </div>
            )}
            {q.type === 'SHORT_ANSWER' && (
              <div className="ml-11">
                <input type="text" placeholder="답을 입력하세요" value={String(answers[idx] || '')}
                  onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}
        className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition text-sm">
        제출하기 ({answeredCount}/{questions.length} 응답 완료)
      </button>
    </div>
  )
}
