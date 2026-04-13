/**
 * 학년별 퀴즈 문제 은행
 * 난이도(easy/medium/hard) + 영어 독해 지문 + 수능 수학 기출 스타일
 */

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  number: number
  type: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER'
  question: string
  options?: string[]
  answer: number | string
  explanation: string
  difficulty: Difficulty
  passage?: string // 독해 지문
}

// ================================================================
//  문제 은행: 학년 > 과목 > Question[]
// ================================================================
export const QUESTION_BANK: Record<string, Record<string, Question[]>> = {

  // ══════════════════════════════════════════════
  //  초등학교 1학년
  // ══════════════════════════════════════════════
  'ELEMENTARY_1': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 자음이 아닌 것은?', options:['ㄱ','ㅏ','ㅂ','ㄷ'], answer:1, explanation:'ㅏ는 모음입니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"나무"의 첫 글자 자음은?', options:['ㄴ','ㄷ','ㅁ','ㅂ'], answer:0, explanation:'"나"의 자음은 ㄴ입니다.', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'다음 중 모음만 모인 것은?', options:['ㅏ,ㅓ,ㅗ','ㄱ,ㅏ,ㅓ','ㅂ,ㅗ,ㅜ','ㄷ,ㅡ,ㅣ'], answer:0, explanation:'ㅏ, ㅓ, ㅗ는 모두 모음입니다.', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"엄마"의 글자 수는?', options:['1개','2개','3개','4개'], answer:1, explanation:'"엄"+"마" = 2글자입니다.', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'받침 "ㄹ"이 들어간 글자는?', options:['가','달','나','바'], answer:1, explanation:'"달"의 받침이 ㄹ입니다.', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'다음 문장에서 빈칸에 들어갈 말은? "나는 학교에 ___."', options:['갑니다','예쁩니다','큽니다','작습니다'], answer:0, explanation:'"갑니다"가 자연스럽습니다.', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'다음 중 올바른 인사말은?', options:['안녕히 가세요','안녕히 갔어요','안녕히 갈게요','안녕히 간다'], answer:0, explanation:'"안녕히 가세요"가 올바른 이별 인사입니다.', difficulty:'medium' },
      { number:8, type:'SHORT_ANSWER', question:'"ㅎ"으로 시작하는 동물 이름을 하나 쓰세요.', answer:'호랑이', explanation:'호랑이, 하마, 학 등이 있습니다.', difficulty:'medium' },
      { number:9, type:'SHORT_ANSWER', question:'"가나다라마바사"에서 세 번째 글자를 쓰세요.', answer:'다', explanation:'가-나-다 순서로 세 번째는 "다"입니다.', difficulty:'easy' },
      { number:10, type:'SHORT_ANSWER', question:'"사과"에서 첫 글자의 자음을 쓰세요.', answer:'ㅅ', explanation:'"사"의 자음은 ㅅ입니다.', difficulty:'hard' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'알파벳 A 다음에 오는 글자는?', options:['C','B','D','E'], answer:1, explanation:'A-B-C-D-E 순서', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"Apple"은 무슨 뜻인가요?', options:['바나나','사과','포도','딸기'], answer:1, explanation:'Apple은 사과입니다.', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'영어로 "1"은?', options:['Two','Three','One','Four'], answer:2, explanation:'One은 1입니다.', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"Dog"는 어떤 동물인가요?', options:['고양이','강아지','새','물고기'], answer:1, explanation:'Dog는 강아지입니다.', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'빨간색을 영어로 하면?', options:['Blue','Green','Red','Yellow'], answer:2, explanation:'Red는 빨간색입니다.', difficulty:'easy' },
      { number:6, type:'MULTIPLE_CHOICE', question:'알파벳은 총 몇 개인가요?', options:['24개','25개','26개','27개'], answer:2, explanation:'A~Z 총 26개입니다.', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"Thank you"는 무슨 뜻인가요?', options:['미안해요','감사합니다','안녕하세요','잘 가요'], answer:1, explanation:'Thank you = 감사합니다', difficulty:'easy' },
      { number:8, type:'MULTIPLE_CHOICE', question:'"Book"은 무엇인가요?', options:['연필','공책','책','지우개'], answer:2, explanation:'Book = 책', difficulty:'easy' },
      { number:9, type:'SHORT_ANSWER', question:'"안녕하세요"를 영어로 쓰세요.', answer:'Hello', explanation:'Hello = 안녕하세요', difficulty:'medium' },
      { number:10, type:'SHORT_ANSWER', question:'"Cat"의 뜻을 쓰세요.', answer:'고양이', explanation:'Cat = 고양이', difficulty:'medium' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'3 + 4 = ?', options:['5','6','7','8'], answer:2, explanation:'3 + 4 = 7', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'5 + 5 = ?', options:['8','9','10','11'], answer:2, explanation:'5 + 5 = 10', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'9 - 4 = ?', options:['3','4','5','6'], answer:2, explanation:'9 - 4 = 5', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'7보다 2 큰 수는?', options:['5','8','9','10'], answer:2, explanation:'7 + 2 = 9', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'10 - 7 = ?', options:['1','2','3','4'], answer:2, explanation:'10 - 7 = 3', difficulty:'easy' },
      { number:6, type:'MULTIPLE_CHOICE', question:'다음 중 가장 큰 수는?', options:['3','7','5','2'], answer:1, explanation:'7이 가장 큽니다.', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'6 + 3 = ?', options:['7','8','9','10'], answer:2, explanation:'6 + 3 = 9', difficulty:'easy' },
      { number:8, type:'SHORT_ANSWER', question:'8 - 3 = ?', answer:'5', explanation:'8 - 3 = 5', difficulty:'easy' },
      { number:9, type:'SHORT_ANSWER', question:'2 + 6 = ?', answer:'8', explanation:'2 + 6 = 8', difficulty:'easy' },
      { number:10, type:'SHORT_ANSWER', question:'1 + 2 + 3 = ?', answer:'6', explanation:'1+2=3, 3+3=6', difficulty:'hard' },
    ],
  },

  // ══════════════════════════════════════════════
  //  초등학교 3학년
  // ══════════════════════════════════════════════
  'ELEMENTARY_3': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 의성어는?', options:['빨갛다','멍멍','천천히','예쁘다'], answer:1, explanation:'"멍멍"은 소리를 흉내 낸 의성어입니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'문장의 끝에 찍는 것은?', options:['쉼표','마침표','물음표','느낌표'], answer:1, explanation:'평서문 끝에는 마침표(.)를 찍습니다.', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'다음 중 의태어는?', options:['왈왈','반짝반짝','쿵쿵','꼬끼오'], answer:1, explanation:'"반짝반짝"은 모양을 흉내 낸 의태어입니다.', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"감사합니다"와 비슷한 말은?', options:['미안합니다','고맙습니다','안녕하세요','실례합니다'], answer:1, explanation:'"고맙습니다" = "감사합니다"', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'글의 중심 문장은 보통 어디에 있나요?', options:['문단의 처음이나 끝','글의 제목','글쓴이 이름 옆','페이지 번호 옆'], answer:0, explanation:'중심 문장은 보통 문단의 처음이나 끝에 있습니다.', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'다음 중 높임말이 아닌 것은?', options:['드시다','주무시다','먹다','계시다'], answer:2, explanation:'"먹다"는 높임말이 아닙니다.', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"나는 학생입니다"에서 주어는?', options:['나는','학생','입니다','학생입니다'], answer:0, explanation:'"나는"이 주어입니다.', difficulty:'hard' },
      { number:8, type:'SHORT_ANSWER', question:'"꽃이 활짝 피었다"에서 꾸며주는 말을 쓰세요.', answer:'활짝', explanation:'"활짝"은 부사입니다.', difficulty:'medium' },
      { number:9, type:'SHORT_ANSWER', question:'받아쓰기: "학교"의 받침을 가진 글자를 쓰세요.', answer:'학', explanation:'"학"에 받침 ㄱ이 있습니다.', difficulty:'easy' },
      { number:10, type:'SHORT_ANSWER', question:'"해"의 반대말을 쓰세요.', answer:'달', explanation:'해(낮)↔달(밤)', difficulty:'hard' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'"How are you?"에 대한 올바른 대답은?', options:["I'm fine","I'm sorry","Goodbye","Thank you"], answer:0, explanation:'"I\'m fine"이 적절합니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"I ___ a student."에 들어갈 말은?', options:['is','am','are','be'], answer:1, explanation:'주어 I → am', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"Banana"는 무엇인가요?', options:['채소','과일','고기','빵'], answer:1, explanation:'Banana = 과일', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'영어로 "3월"은?', options:['January','February','March','April'], answer:2, explanation:'March = 3월', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"What is this?" "It is a ___." (연필)', options:['pen','pencil','book','eraser'], answer:1, explanation:'pencil = 연필', difficulty:'easy' },
      { number:6, type:'MULTIPLE_CHOICE', question:'다음 중 과일이 아닌 것은?', options:['Apple','Orange','Carrot','Grape'], answer:2, explanation:'Carrot = 당근(채소)', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"Five"는 숫자 몇?', options:['3','4','5','6'], answer:2, explanation:'Five = 5', difficulty:'easy' },
      { number:8, type:'SHORT_ANSWER', question:'"Monday" 다음 요일을 영어로 쓰세요.', answer:'Tuesday', explanation:'Monday → Tuesday', difficulty:'hard' },
      { number:9, type:'SHORT_ANSWER', question:'"She ___ a teacher." 빈칸에 들어갈 말을 쓰세요.', answer:'is', explanation:'She → is', difficulty:'medium' },
      { number:10, type:'SHORT_ANSWER', question:'"Good morning"의 뜻을 쓰세요.', answer:'좋은 아침', explanation:'Good morning = 좋은 아침', difficulty:'easy' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'245 + 138 = ?', options:['373','383','393','363'], answer:1, explanation:'245 + 138 = 383', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'4 × 7 = ?', options:['21','24','28','32'], answer:2, explanation:'4 × 7 = 28', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'56 ÷ 8 = ?', options:['6','7','8','9'], answer:1, explanation:'56 ÷ 8 = 7', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'1km는 몇 m?', options:['10m','100m','1000m','10000m'], answer:2, explanation:'1km = 1000m', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'□ × 6 = 42일 때, □는?', options:['6','7','8','9'], answer:1, explanation:'42 ÷ 6 = 7', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'분수 1/2과 크기가 같은 것은?', options:['1/3','2/4','2/3','3/4'], answer:1, explanation:'1/2 = 2/4', difficulty:'hard' },
      { number:7, type:'MULTIPLE_CHOICE', question:'삼각형의 꼭짓점 수는?', options:['2개','3개','4개','5개'], answer:1, explanation:'삼각형의 꼭짓점은 3개입니다.', difficulty:'easy' },
      { number:8, type:'SHORT_ANSWER', question:'500 - 238 = ?', answer:'262', explanation:'500 - 238 = 262', difficulty:'medium' },
      { number:9, type:'SHORT_ANSWER', question:'9 × 9 = ?', answer:'81', explanation:'9 × 9 = 81', difficulty:'easy' },
      { number:10, type:'SHORT_ANSWER', question:'72 ÷ 9 = ?', answer:'8', explanation:'72 ÷ 9 = 8', difficulty:'medium' },
    ],
  },

  // ══════════════════════════════════════════════
  //  초등학교 5학년
  // ══════════════════════════════════════════════
  'ELEMENTARY_5': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 관용어의 뜻이 올바른 것은?', options:['"발이 넓다" - 걷기를 좋아한다','"귀가 얇다" - 남의 말에 잘 속는다','"손이 크다" - 손이 물리적으로 크다','"눈이 높다" - 시력이 좋다'], answer:1, explanation:'"귀가 얇다"는 남의 말에 잘 속는다는 뜻입니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'토론에서 "반론"이란?', options:['상대 의견에 동의하는 것','상대 의견에 반대하며 근거를 대는 것','자신의 의견을 정리하는 것','사회자가 정리하는 것'], answer:1, explanation:'반론은 상대 의견에 근거를 들어 반대하는 것입니다.', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'다음 중 "비유"의 종류가 아닌 것은?', options:['직유','은유','의인법','서술법'], answer:3, explanation:'직유, 은유, 의인법은 비유이지만, 서술법은 아닙니다.', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"국어사전"에서 낱말을 찾을 때 순서는?', options:['가나다 순','글자 크기 순','사용 빈도 순','뜻의 수 순'], answer:0, explanation:'국어사전은 가나다 순으로 배열됩니다.', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'글의 종류 중 "설명문"의 목적은?', options:['재미를 주기 위해','정보를 전달하기 위해','감동을 주기 위해','의견을 주장하기 위해'], answer:1, explanation:'설명문은 정보 전달이 목적입니다.', difficulty:'easy' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"하늘이 무너져도 솟아날 구멍이 있다"는 어떤 종류의 표현?', options:['관용어','속담','사자성어','외래어'], answer:1, explanation:'속담은 옛사람들의 지혜가 담긴 짧은 말입니다.', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'다음 문장에서 부사어는? "그는 매우 빠르게 달렸다."', options:['그는','매우','빠르게','달렸다'], answer:1, explanation:'"매우"는 정도를 나타내는 부사입니다.', difficulty:'hard' },
      { number:8, type:'SHORT_ANSWER', question:'"시작이 반이다"와 비슷한 뜻의 속담을 쓰세요.', answer:'천리 길도 한 걸음부터', explanation:'둘 다 시작의 중요성을 강조합니다.', difficulty:'hard' },
      { number:9, type:'SHORT_ANSWER', question:'"높다"의 반의어를 쓰세요.', answer:'낮다', explanation:'높다 ↔ 낮다', difficulty:'easy' },
      { number:10, type:'SHORT_ANSWER', question:'문장 "나는 학교에서 공부를 한다."에서 서술어를 쓰세요.', answer:'한다', explanation:'서술어는 "한다"입니다.', difficulty:'medium' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'"What do you do?" 에 대한 적절한 대답은?', options:["I'm fine.","I'm a student.","I like pizza.","It's Monday."], answer:1, explanation:'직업/하는 일을 묻는 질문입니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"There ___ many books on the desk."', options:['is','am','are','be'], answer:2, explanation:'복수 many books → are', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"I ___ to school every day."', options:['go','goes','going','went'], answer:0, explanation:'주어 I + 현재시제 = go', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"She ___ lunch at 12 o\'clock."', options:['have','has','having','had'], answer:1, explanation:'3인칭 단수 She → has', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"Can you help me?" 의 뜻은?', options:['도와줄까?','도와줄 수 있어?','도와줬어?','도울 거야?'], answer:1, explanation:'Can you ~? = ~할 수 있어?', difficulty:'easy' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"I went to the park yesterday." 의 시제는?', options:['현재','과거','미래','현재진행'], answer:1, explanation:'went(go의 과거형) + yesterday = 과거시제', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'다음 중 복수형이 틀린 것은?', options:['cat → cats','child → childs','box → boxes','dog → dogs'], answer:1, explanation:'child의 복수형은 children(불규칙)입니다.', difficulty:'hard' },
      { number:8, type:'SHORT_ANSWER', question:'"before"의 반대말을 영어로 쓰세요.', answer:'after', explanation:'before(~전) ↔ after(~후)', difficulty:'medium' },
      { number:9, type:'SHORT_ANSWER', question:'"I can swim." 을 부정문으로 쓰세요.', answer:"I can't swim.", explanation:'can → can\'t / cannot', difficulty:'hard' },
      { number:10, type:'SHORT_ANSWER', question:'"12월"을 영어로 쓰세요.', answer:'December', explanation:'12월 = December', difficulty:'medium' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'3/5 + 1/5 = ?', options:['2/5','4/5','4/10','1'], answer:1, explanation:'분모가 같으면 분자끼리 더합니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'1/2 + 1/3 = ?', options:['2/5','2/6','5/6','1/5'], answer:2, explanation:'통분: 3/6 + 2/6 = 5/6', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'소수 2.5 × 4 = ?', options:['8','8.5','10','12.5'], answer:2, explanation:'2.5 × 4 = 10', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'직육면체의 면의 수는?', options:['4개','5개','6개','8개'], answer:2, explanation:'직육면체의 면은 6개입니다.', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'약분: 8/12를 기약분수로 나타내면?', options:['2/3','4/6','2/4','3/4'], answer:0, explanation:'8÷4=2, 12÷4=3 → 2/3', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'평균: 80, 90, 70의 평균은?', options:['75','80','85','90'], answer:1, explanation:'(80+90+70)÷3 = 240÷3 = 80', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'정삼각형의 한 각의 크기는?', options:['30°','45°','60°','90°'], answer:2, explanation:'180° ÷ 3 = 60°', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'밑변 8cm, 높이 5cm인 삼각형의 넓이는?', options:['13cm²','20cm²','40cm²','80cm²'], answer:1, explanation:'삼각형 넓이 = 밑변×높이÷2 = 20', difficulty:'hard' },
      { number:9, type:'SHORT_ANSWER', question:'3/4를 소수로 나타내세요.', answer:'0.75', explanation:'3÷4 = 0.75', difficulty:'hard' },
      { number:10, type:'SHORT_ANSWER', question:'2, 4, 8, 16, ___의 빈칸을 채우세요.', answer:'32', explanation:'×2 규칙: 16×2=32', difficulty:'medium' },
    ],
  },

  // ══════════════════════════════════════════════
  //  중학교 1학년
  // ══════════════════════════════════════════════
  'MIDDLE_1': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'문학에서 "서술자"란?', options:['글을 쓴 사람','작품 속에서 이야기를 전하는 존재','주인공','독자'], answer:1, explanation:'서술자는 이야기를 전하는 작품 속 존재입니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'다음 중 "비유법"이 아닌 것은?', options:['직유법','은유법','의인법','대조법'], answer:3, explanation:'대조법은 비유가 아닌 대비의 표현입니다.', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"눈 위의 매화 한 가지"에서 쓰인 표현법은?', options:['직유법','은유법','역설법','반어법'], answer:1, explanation:'직접 비유하지 않고 A=B로 표현하는 은유법입니다.', difficulty:'hard' },
      { number:4, type:'MULTIPLE_CHOICE', question:'품사 중 "형용사"의 예는?', options:['달리다','예쁘다','학교','빨리'], answer:1, explanation:'"예쁘다"는 성질/상태를 나타내는 형용사입니다.', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"자음동화"가 일어난 것은?', options:['"국물"→[궁물]','"꽃잎"→[꼰닙]','"솔나무"→[솔라무]','"굳이"→[구지]'], answer:0, explanation:'ㄱ+ㅁ → ㅇ+ㅁ 비음동화', difficulty:'hard' },
      { number:6, type:'MULTIPLE_CHOICE', question:'수필의 특징으로 올바른 것은?', options:['운문 형식','허구적 이야기','작가의 개인적 체험과 느낌','극적 구조'], answer:2, explanation:'수필은 작가의 체험과 느낌을 자유롭게 쓴 산문입니다.', difficulty:'medium' },
      { number:7, type:'SHORT_ANSWER', question:'"하늘은 맑고 바다는 푸르다"에서 쓰인 표현법을 쓰세요.', answer:'대구법', explanation:'비슷한 구조를 반복하는 대구법입니다.', difficulty:'hard' },
      { number:8, type:'SHORT_ANSWER', question:'"예쁘다"의 품사를 쓰세요.', answer:'형용사', explanation:'성질/상태를 나타내므로 형용사입니다.', difficulty:'medium' },
      { number:9, type:'MULTIPLE_CHOICE', question:'글의 구조 "서론-본론-결론"에서 본론의 역할은?', options:['주제 소개','주장에 대한 근거 제시','결론 요약','독자의 흥미 유발'], answer:1, explanation:'본론은 주장에 대한 근거를 제시합니다.', difficulty:'easy' },
      { number:10, type:'MULTIPLE_CHOICE', question:'다음 중 접속어 "그러나"의 기능은?', options:['나열','역접','인과','보충'], answer:1, explanation:'"그러나"는 앞뒤 내용이 반대될 때 씁니다.', difficulty:'medium' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'"She ___ playing tennis now."', options:['is','are','am','was'], answer:0, explanation:'She + 현재진행 = is playing', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"I have ___ to Seoul before."', options:['go','went','gone','going'], answer:2, explanation:'have + p.p. (현재완료) = have gone', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"This book is ___ than that one."', options:['interesting','more interesting','most interesting','interestinger'], answer:1, explanation:'비교급: more interesting', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'다음 중 "과거형"이 불규칙인 것은?', options:['play-played','walk-walked','eat-ate','talk-talked'], answer:2, explanation:'eat→ate (불규칙 변화)', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"If it rains tomorrow, I ___ stay home."', options:['will','would','am','do'], answer:0, explanation:'조건절(if)+현재, 주절+will = 1차 조건문', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"The movie ___ by many people."', options:['watch','watches','is watched','watching'], answer:2, explanation:'수동태: is watched by ~', difficulty:'hard' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"I want ___ a doctor."', options:['be','to be','being','been'], answer:1, explanation:'want + to 부정사', difficulty:'easy' },
      { number:8, type:'SHORT_ANSWER', question:'"buy"의 과거형을 쓰세요.', answer:'bought', explanation:'buy → bought (불규칙)', difficulty:'medium' },
      { number:9, type:'SHORT_ANSWER', question:'"good"의 비교급을 쓰세요.', answer:'better', explanation:'good → better → best (불규칙)', difficulty:'medium' },
      { number:10, type:'SHORT_ANSWER', question:'"He can swim."을 의문문으로 바꾸세요.', answer:'Can he swim?', explanation:'조동사를 앞으로: Can he swim?', difficulty:'hard' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'(-3) × (-4) = ?', options:['-12','-7','7','12'], answer:3, explanation:'음수×음수=양수: 12', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'일차방정식 2x + 3 = 11의 해는?', options:['x=3','x=4','x=5','x=7'], answer:1, explanation:'2x=8 → x=4', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'좌표평면에서 점 (3, -2)는 어느 사분면?', options:['제1사분면','제2사분면','제3사분면','제4사분면'], answer:3, explanation:'x>0, y<0 → 제4사분면', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'비례식 2:3 = x:12에서 x는?', options:['6','8','9','10'], answer:1, explanation:'2×12 = 3×x → x=8', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'정비례 y=2x에서 x=5일 때 y는?', options:['7','8','10','12'], answer:2, explanation:'y=2×5=10', difficulty:'easy' },
      { number:6, type:'MULTIPLE_CHOICE', question:'원의 둘레 공식은? (반지름 r)', options:['πr','2πr','πr²','2πr²'], answer:1, explanation:'원의 둘레 = 2πr', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'|-7| + |3| = ?', options:['4','-4','10','-10'], answer:2, explanation:'|-7|=7, |3|=3, 7+3=10', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'일차부등식 3x - 1 > 8의 해는?', options:['x>2','x>3','x>4','x>9'], answer:1, explanation:'3x>9 → x>3', difficulty:'hard' },
      { number:9, type:'SHORT_ANSWER', question:'(-2)³ = ?', answer:'-8', explanation:'(-2)×(-2)×(-2) = 4×(-2) = -8', difficulty:'medium' },
      { number:10, type:'SHORT_ANSWER', question:'1/2 + 1/3 + 1/6 = ?', answer:'1', explanation:'3/6 + 2/6 + 1/6 = 6/6 = 1', difficulty:'hard' },
    ],
  },

  // ══════════════════════════════════════════════
  //  중학교 3학년
  // ══════════════════════════════════════════════
  'MIDDLE_3': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 "시적 화자"의 설명으로 옳은 것은?', options:['시를 쓴 작가','시 속에서 말하는 존재','시를 읽는 독자','시를 분석하는 비평가'], answer:1, explanation:'시적 화자 = 시 속에서 말하는 존재', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"역설"의 의미는?', options:['같은 말 반복','겉과 속이 반대','모순 속에 진리','과장된 표현'], answer:2, explanation:'역설은 모순처럼 보이지만 깊은 진리를 담고 있습니다.', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'논설문에서 "논거"란?', options:['글의 제목','주장을 뒷받침하는 근거','결론 요약','서론의 첫 문장'], answer:1, explanation:'논거 = 주장의 근거', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"이중 모음"에 해당하지 않는 것은?', options:['ㅘ','ㅚ','ㅏ','ㅢ'], answer:2, explanation:'ㅏ는 단모음입니다.', difficulty:'hard' },
      { number:5, type:'MULTIPLE_CHOICE', question:'소설의 3요소가 아닌 것은?', options:['인물','사건','배경','운율'], answer:3, explanation:'소설의 3요소: 인물, 사건, 배경. 운율은 시의 요소.', difficulty:'medium' },
      { number:6, type:'SHORT_ANSWER', question:'"봄이 오면 꽃이 핀다"에서 종속절을 쓰세요.', answer:'봄이 오면', explanation:'"봄이 오면"은 조건의 종속절입니다.', difficulty:'hard' },
      { number:7, type:'SHORT_ANSWER', question:'형태소 "먹었다"를 분석하세요 (형태소 수).', answer:'3', explanation:'먹- + -었- + -다 = 3개', difficulty:'hard' },
      { number:8, type:'MULTIPLE_CHOICE', question:'문학의 갈래 중 "서사"에 해당하는 것은?', options:['시','소설','수필','희곡'], answer:1, explanation:'서사 갈래: 소설, 신화, 전설 등', difficulty:'medium' },
      { number:9, type:'MULTIPLE_CHOICE', question:'"미디어 리터러시"란?', options:['미디어 기기 사용법','미디어 정보를 비판적으로 이해하는 능력','미디어 콘텐츠 제작 기술','SNS 활용법'], answer:1, explanation:'미디어 리터러시 = 미디어를 비판적으로 이해하고 활용하는 능력', difficulty:'medium' },
      { number:10, type:'MULTIPLE_CHOICE', question:'다음 중 "피동 표현"은?', options:['철수가 밥을 먹는다','꽃이 바람에 꺾였다','나는 학교에 간다','그는 노래를 부른다'], answer:1, explanation:'"꺾였다"는 피동 표현(-이-+었)입니다.', difficulty:'hard' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'"The book ___ on the table when I came back."', options:['is','was','were','been'], answer:1, explanation:'과거 시점 → was', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"I wish I ___ a bird."', options:['am','was','were','be'], answer:2, explanation:'가정법 과거: I wish + were', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"She asked me ___ I was from."', options:['what','where','who','which'], answer:1, explanation:'출신지를 묻는 간접의문문 → where', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"He ___ English for 5 years."', options:['study','studies','has studied','studied'], answer:2, explanation:'for 5 years → 현재완료(has studied)', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"분사"의 종류 2가지는?', options:['현재분사, 과거분사','동명사, 부정사','능동, 피동','주격, 목적격'], answer:0, explanation:'분사: 현재분사(-ing), 과거분사(-ed/p.p.)', difficulty:'easy' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"The man ___ is tall is my father." (관계대명사)', options:['who','which','what','whom'], answer:0, explanation:'사람 선행사 + 주격 관계대명사 = who', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"If I had studied harder, I ___ the exam." (가정법 과거완료)', options:['will pass','would pass','would have passed','had passed'], answer:2, explanation:'가정법 과거완료: would have + p.p.', difficulty:'hard' },
      { number:8, type:'SHORT_ANSWER', question:'"too ~ to" 구문을 "so ~ that"으로 바꿀 수 있습니다. "He is too young to drive."를 바꾸세요.', answer:'He is so young that he cannot drive.', explanation:'too~to = so~that+cannot', difficulty:'hard' },
      { number:9, type:'SHORT_ANSWER', question:'"write"의 과거분사를 쓰세요.', answer:'written', explanation:'write-wrote-written', difficulty:'medium' },
      { number:10, type:'MULTIPLE_CHOICE', question:'"Neither A nor B" 구문의 동사 수일치는?', options:['항상 단수','항상 복수','A에 일치','B에 일치'], answer:3, explanation:'Neither A nor B에서 동사는 B에 수일치', difficulty:'hard' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'이차방정식 x²-5x+6=0의 해는?', options:['x=1, x=6','x=2, x=3','x=-2, x=-3','x=1, x=5'], answer:1, explanation:'(x-2)(x-3)=0 → x=2, x=3', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'피타고라스 정리: 직각삼각형에서 두 변이 3, 4이면 빗변은?', options:['5','6','7','8'], answer:0, explanation:'3²+4²=25, √25=5', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'이차함수 y=x²-4x+3의 꼭짓점 x좌표는?', options:['1','2','3','4'], answer:1, explanation:'x=-b/2a=-(-4)/2=2', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'√50을 간단히 하면?', options:['5√2','2√5','25√2','√25×2'], answer:0, explanation:'√50=√(25×2)=5√2', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'sin30°= ?', options:['1/2','√2/2','√3/2','1'], answer:0, explanation:'sin30°=1/2', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'원에 내접하는 사각형의 대각의 합은?', options:['90°','180°','270°','360°'], answer:1, explanation:'원에 내접하는 사각형의 대각의 합=180°', difficulty:'hard' },
      { number:7, type:'MULTIPLE_CHOICE', question:'이차방정식 x²+2x-8=0의 근의 합은?', options:['-2','2','-4','4'], answer:0, explanation:'근과 계수의 관계: 합=-b/a=-2', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'대각선의 개수 공식 n(n-3)/2에서, 오각형의 대각선 수는?', options:['3개','4개','5개','6개'], answer:2, explanation:'5(5-3)/2=5', difficulty:'medium' },
      { number:9, type:'SHORT_ANSWER', question:'이차방정식 x²-9=0의 해를 구하세요 (양수).', answer:'3', explanation:'x²=9 → x=±3, 양수는 3', difficulty:'easy' },
      { number:10, type:'SHORT_ANSWER', question:'cos60°= ?', answer:'1/2', explanation:'cos60°=1/2', difficulty:'hard' },
    ],
  },

  // ══════════════════════════════════════════════
  //  고등학교 1학년
  // ══════════════════════════════════════════════
  'HIGH_1': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 "화법"에 해당하는 것은?', options:['글쓰기','발표와 토론','독서','문법 분석'], answer:1, explanation:'화법은 말하기와 듣기입니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"봄봄" (김유정)의 서술 시점은?', options:['1인칭 관찰자','1인칭 주인공','3인칭 전지적','3인칭 관찰자'], answer:1, explanation:'1인칭 주인공 시점입니다.', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'다음 중 현대시에서 "심상"의 종류가 아닌 것은?', options:['시각적 심상','청각적 심상','미각적 심상','논리적 심상'], answer:3, explanation:'심상은 감각적 이미지입니다.', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'다음 형태소 분석에서 "먹었다"의 형태소 개수는?', options:['1개','2개','3개','4개'], answer:2, explanation:'먹-+-었-+-다 = 3개', difficulty:'hard' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"갈래"에 따른 문학 분류에서, "수필"이 속하는 갈래는?', options:['서정','서사','교술','극'], answer:2, explanation:'수필은 교술 갈래입니다.', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'다음 중 음운 변동의 예로 올바른 것은?', options:['"국물"→[궁물]은 비음화','"같이"→[가치]는 구개음화','"꽃잎"→[꼰닙]은 된소리되기','"밥물"→[밤물]은 유음화'], answer:0, explanation:'ㄱ+ㅁ→ㅇ+ㅁ 비음화', difficulty:'hard' },
      { number:7, type:'MULTIPLE_CHOICE', question:'다음 중 "매체 언어"의 특성이 아닌 것은?', options:['복합 양식성','상호작용성','일방향성','즉시성'], answer:2, explanation:'매체 언어는 쌍방향적입니다.', difficulty:'medium' },
      { number:8, type:'SHORT_ANSWER', question:'비문학에서 두 대상의 공통점과 차이점을 제시하는 방법은?', answer:'비교와 대조', explanation:'비교(공통점)와 대조(차이점)', difficulty:'easy' },
      { number:9, type:'SHORT_ANSWER', question:'문학의 기능 중, 독자에게 즐거움을 주는 기능은?', answer:'쾌락적 기능', explanation:'문학의 기능: 쾌락적, 교훈적, 인식적', difficulty:'hard' },
      { number:10, type:'SHORT_ANSWER', question:'"윤동주"의 대표 시 제목을 쓰세요.', answer:'서시', explanation:'"죽는 날까지 하늘을 우러러..."', difficulty:'medium' },
    ],
    '영어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'"If I ___ rich, I would travel the world."', options:['am','was','were','be'], answer:2, explanation:'가정법 과거: were', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'관계부사 "where"을 쓸 수 있는 선행사는?', options:['시간','장소','이유','방법'], answer:1, explanation:'where = 장소 선행사', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"Not only A but also B"의 뜻은?', options:['A뿐만 아니라 B도','A가 아니라 B','A 또는 B','A와 B 둘 다 아닌'], answer:0, explanation:'A뿐만 아니라 B도', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"The building ___ in 1990."', options:['built','was built','is built','has built'], answer:1, explanation:'수동태 과거: was built', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"분사구문"이란?', options:['명사를 수식하는 구문','부사절을 줄인 구문','형용사를 강조하는 구문','의문문을 만드는 구문'], answer:1, explanation:'분사구문 = 부사절 축약', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"I regret ___ that." (과거의 행동 후회)', options:['say','to say','saying','said'], answer:2, explanation:'regret + ~ing = 과거 행동 후회', difficulty:'hard' },
      { number:7, type:'MULTIPLE_CHOICE', question:'5형식 "I found the book interesting."에서 interesting의 역할은?', options:['주어','목적어','목적격 보어','부사'], answer:2, explanation:'S+V+O+OC → interesting = 목적격 보어', difficulty:'hard' },
      { number:8, type:'SHORT_ANSWER', question:'"She has been studying for 3 hours."의 시제를 쓰세요.', answer:'현재완료진행', explanation:'has been ~ing = 현재완료진행', difficulty:'medium' },
      { number:9, type:'SHORT_ANSWER', question:'"가정법 현재: It is important that he ___ hard." 빈칸을 쓰세요.', answer:'study', explanation:'that절에서 동사원형 사용', difficulty:'hard' },
      { number:10, type:'SHORT_ANSWER', question:'"강조구문: I met Tom yesterday."에서 Tom을 강조하세요.', answer:'It is Tom that I met yesterday.', explanation:'It is/was ~ that 강조구문', difficulty:'hard' },
    ],
    '수학': [
      { number:1, type:'MULTIPLE_CHOICE', question:'(x+2)(x-3)을 전개하면?', options:['x²-x-6','x²+x-6','x²-x+6','x²+x+6'], answer:0, explanation:'x²-3x+2x-6=x²-x-6', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'이차부등식 x²-4<0의 해는?', options:['x<-2 또는 x>2','-2<x<2','x<2','x>-2'], answer:1, explanation:'(x-2)(x+2)<0 → -2<x<2', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'함수 f(x)=2x+1에서 f(3)은?', options:['5','6','7','8'], answer:2, explanation:'f(3)=2(3)+1=7', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'다항식 x³+x²-2x를 인수분해하면?', options:['x(x+2)(x-1)','x(x-2)(x+1)','x(x²-2)','(x+1)(x²-2x)'], answer:0, explanation:'x(x²+x-2)=x(x+2)(x-1)', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'나머지정리: f(x)=x²+3x-4를 (x-1)로 나눈 나머지는?', options:['-4','0','2','4'], answer:1, explanation:'f(1)=1+3-4=0', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'log₂8 = ?', options:['2','3','4','8'], answer:1, explanation:'2³=8 → log₂8=3', difficulty:'easy' },
      { number:7, type:'MULTIPLE_CHOICE', question:'이차방정식 x²-6x+k=0이 중근을 가지려면 k는?', options:['6','8','9','12'], answer:2, explanation:'D=36-4k=0 → k=9', difficulty:'hard' },
      { number:8, type:'MULTIPLE_CHOICE', question:'집합 A={1,2,3}, B={2,3,4}일 때 A∪B의 원소 개수는?', options:['3','4','5','6'], answer:1, explanation:'A∪B={1,2,3,4} → 4개', difficulty:'medium' },
      { number:9, type:'SHORT_ANSWER', question:'x²+5x+6을 인수분해하세요.', answer:'(x+2)(x+3)', explanation:'합5, 곱6 → 2, 3', difficulty:'easy' },
      { number:10, type:'SHORT_ANSWER', question:'|x-3|=5의 해를 모두 구하세요 (작은 수부터).', answer:'-2, 8', explanation:'x-3=5→x=8, x-3=-5→x=-2', difficulty:'hard' },
    ],
  },

  // ══════════════════════════════════════════════
  //  고등학교 3학년 (수능 대비) — 대폭 확장
  // ══════════════════════════════════════════════
  'HIGH_3': {
    '국어': [
      { number:1, type:'MULTIPLE_CHOICE', question:'수능 국어에서 "화작문"이 의미하는 것은?', options:['화법과 작문','화학과 문학','화법과 문법','화학과 문법'], answer:0, explanation:'화작문 = 화법과 작문', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'비문학 지문에서 "역접" 접속어는?', options:['그리고','따라서','하지만','예를 들어'], answer:2, explanation:'"하지만"은 역접입니다.', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'다음 중 "음운의 축약"에 해당하는 것은?', options:['놓다→[노타]','국물→[궁물]','굳이→[구지]','좋다→[조타]'], answer:3, explanation:'ㅎ+ㄷ→ㅌ 거센소리되기(축약)', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'고전소설 "홍길동전"의 작가는?', options:['김시습','허균','박지원','정약용'], answer:1, explanation:'허균 작, 최초의 한글 소설', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'수능 언어에서 "형태소"의 정의는?', options:['뜻을 가진 가장 작은 단위','소리의 최소 단위','문장의 최소 단위','단어의 최소 단위'], answer:0, explanation:'형태소 = 뜻의 최소 단위', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'수능 독서에서 "추론적 읽기"란?', options:['직접 나타난 정보만 파악','나타나지 않은 내용을 짐작','형식만 분석','오류를 찾는 것'], answer:1, explanation:'추론적 읽기 = 문맥에서 짐작', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"사미인곡"의 작가는?', options:['윤선도','정철','이황','이이'], answer:1, explanation:'정철(호: 송강)의 가사', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'수능 비문학에서 "전제"란?', options:['글의 결론','주장의 근거가 되는 가정','예시 자료','반론'], answer:1, explanation:'전제 = 주장의 바탕이 되는 가정', difficulty:'hard' },
      { number:9, type:'MULTIPLE_CHOICE', question:'"님의 침묵"(한용운)에서 "님"이 상징하는 것은?', options:['연인만','조국/절대적 가치','친구','부모'], answer:1, explanation:'"님"은 조국, 불교적 절대 가치 등 다의적 상징입니다.', difficulty:'hard' },
      { number:10, type:'MULTIPLE_CHOICE', question:'고전문학에서 "가사"의 형식은?', options:['3·4조 연속체','4·4조 연속체','자유시','시조 형식'], answer:1, explanation:'가사는 4·4조(또는 3·4조) 연속체입니다.', difficulty:'hard' },
      { number:11, type:'SHORT_ANSWER', question:'수능 문학에서 외적 준거에 의한 감상이란?', answer:'작품 외부의 사회 역사적 맥락으로 감상하는 것', explanation:'외적 준거: 작가론, 반영론, 수용론', difficulty:'hard' },
      { number:12, type:'SHORT_ANSWER', question:'김소월의 "진달래꽃" 화자의 정서를 한 단어로?', answer:'이별', explanation:'임과의 이별을 노래한 시', difficulty:'medium' },
    ],

    // ────────── 영어 (독해 + 수능형) ──────────
    '영어': [
      // === 문법/어휘 기본 ===
      { number:1, type:'MULTIPLE_CHOICE', question:'"Had I known the truth, I would have acted differently." 이 문장의 시제는?', options:['가정법 과거','가정법 과거완료','가정법 미래','가정법 현재'], answer:1, explanation:'Had+S+p.p. = 가정법 과거완료 도치', difficulty:'medium' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"It goes without saying that ~"의 뜻은?', options:['~이 중요하다','~은 말할 것도 없다','~을 알 수 없다','~은 불가능하다'], answer:1, explanation:'"~은 말할 필요도 없다"', difficulty:'medium' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"A is to B what C is to D"의 뜻은?', options:['A는 B보다 크다','A:B = C:D 관계','A는 B가 아니라 C이다','A와 D는 같다'], answer:1, explanation:'비례 관계 표현', difficulty:'hard' },
      { number:4, type:'SHORT_ANSWER', question:'"regardless of"의 뜻을 쓰세요.', answer:'~에 관계없이', explanation:'regardless of = ~에 상관없이', difficulty:'easy' },
      { number:5, type:'SHORT_ANSWER', question:'"The more you practice, the better you become."의 문법 구조는?', answer:'the 비교급 the 비교급', explanation:'"~할수록 더 ~하다" 구문', difficulty:'medium' },

      // === 수능형 빈칸추론 ===
      { number:6, type:'MULTIPLE_CHOICE', question:'수능 영어 빈칸추론에서 가장 중요한 전략은?', options:['문법 분석','단어 암기','문맥 파악','속도 높이기'], answer:2, explanation:'빈칸추론의 핵심은 문맥 파악입니다.', difficulty:'easy' },
      { number:7, type:'MULTIPLE_CHOICE', question:'수능 영어 문장 삽입 문제의 핵심 단서는?', options:['문장의 길이','지시어와 연결어','단어의 난이도','문법 구조'], answer:1, explanation:'지시어(this, such)와 연결어(however)가 핵심', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'"무관한 문장 찾기"의 핵심 전략은?', options:['가장 긴 문장','주제와 관련 없는 문장','첫 번째 문장','마지막 문장'], answer:1, explanation:'글의 주제에서 벗어난 문장을 찾습니다.', difficulty:'easy' },
      { number:9, type:'MULTIPLE_CHOICE', question:'수능 영어 "요지 파악"에서 정답 위치는 주로?', options:['글의 처음과 끝','글의 가운데만','마지막 문장만','규칙 없음'], answer:0, explanation:'요지는 대체로 처음이나 끝에 나타납니다.', difficulty:'easy' },

      // === 독해 지문 - 환경 ===
      { number:10, type:'MULTIPLE_CHOICE', difficulty:'medium',
        passage:'The ocean absorbs about 30% of the carbon dioxide produced by humans. While this might seem beneficial for reducing atmospheric CO2, it comes at a great cost. The absorbed CO2 reacts with seawater to form carbonic acid, leading to ocean acidification. This process threatens marine ecosystems, particularly organisms that build shells or skeletons from calcium carbonate, such as corals and mollusks.',
        question:'이 글의 주제로 가장 적절한 것은?',
        options:['해양 생물의 다양성','이산화탄소 배출량 감소','해양의 CO2 흡수로 인한 산성화 문제','산호초 보호 방법'],
        answer:2, explanation:'바다가 CO2를 흡수하면서 산성화가 진행되고, 이것이 해양 생태계를 위협한다는 내용입니다.' },

      { number:11, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'The ocean absorbs about 30% of the carbon dioxide produced by humans. While this might seem beneficial for reducing atmospheric CO2, it comes at a great cost. The absorbed CO2 reacts with seawater to form carbonic acid, leading to ocean acidification. This process threatens marine ecosystems, particularly organisms that build shells or skeletons from calcium carbonate, such as corals and mollusks.',
        question:'밑줄 친 "it comes at a great cost"에서 "cost"가 의미하는 것은?',
        options:['경제적 비용','시간적 손실','해양 생태계에 대한 피해','에너지 소비'],
        answer:2, explanation:'CO2 흡수의 대가로 해양 산성화가 발생하여 생태계가 피해를 입는다는 뜻입니다.' },

      // === 독해 지문 - 심리학 ===
      { number:12, type:'MULTIPLE_CHOICE', difficulty:'medium',
        passage:'The Dunning-Kruger effect is a cognitive bias in which people with limited competence in a domain overestimate their own ability. Conversely, experts tend to underestimate their competence, assuming that tasks easy for them are easy for everyone. This asymmetry in self-assessment has significant implications for education, workplace management, and public discourse.',
        question:'이 글에 따르면, 전문가들은 어떤 경향이 있는가?',
        options:['자신의 능력을 과대평가한다','자신의 능력을 과소평가한다','다른 사람을 무시한다','자신감이 매우 높다'],
        answer:1, explanation:'전문가는 자신에게 쉬운 것이 모두에게 쉽다고 가정하여 과소평가하는 경향이 있습니다.' },

      { number:13, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'The Dunning-Kruger effect is a cognitive bias in which people with limited competence in a domain overestimate their own ability. Conversely, experts tend to underestimate their competence, assuming that tasks easy for them are easy for everyone. This asymmetry in self-assessment has significant implications for education, workplace management, and public discourse.',
        question:'이 글의 빈칸에 들어갈 말로 가장 적절한 것은? "The Dunning-Kruger effect reveals a fundamental _____ between actual ability and perceived ability."',
        options:['connection','gap','similarity','improvement'],
        answer:1, explanation:'실제 능력과 인식된 능력 사이의 "차이(gap)"를 드러낸다는 의미입니다.' },

      // === 독해 지문 - 기술 ===
      { number:14, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'Artificial intelligence systems are increasingly being used in hiring processes to screen resumes and conduct initial interviews. Proponents argue that AI can reduce human biases and improve efficiency. However, critics point out that these systems can perpetuate existing biases present in their training data, potentially discriminating against certain demographic groups. The challenge lies in developing AI that is both efficient and equitable.',
        question:'이 글의 요지로 가장 적절한 것은?',
        options:['AI 채용은 인간 편견을 완전히 제거한다','AI 채용 시스템은 효율적이지만 편향성 문제가 있다','AI는 채용 과정에 사용되어서는 안 된다','AI 학습 데이터는 항상 공정하다'],
        answer:1, explanation:'AI 채용의 효율성과 편향성 문제를 함께 다루고 있습니다.' },

      { number:15, type:'MULTIPLE_CHOICE', difficulty:'medium',
        passage:'Artificial intelligence systems are increasingly being used in hiring processes to screen resumes and conduct initial interviews. Proponents argue that AI can reduce human biases and improve efficiency. However, critics point out that these systems can perpetuate existing biases present in their training data, potentially discriminating against certain demographic groups. The challenge lies in developing AI that is both efficient and equitable.',
        question:'"perpetuate"의 의미와 가장 가까운 것은?',
        options:['제거하다','영속시키다','감소시키다','분석하다'],
        answer:1, explanation:'perpetuate = 영속시키다, 지속시키다' },

      // === 독해 지문 - 과학 ===
      { number:16, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'Recent studies have shown that the gut microbiome plays a crucial role not only in digestion but also in mental health. The gut-brain axis, a bidirectional communication network between the gastrointestinal tract and the central nervous system, allows bacteria in the gut to influence mood, cognition, and even behavior. Researchers have found that individuals with depression often have significantly different gut bacteria compositions compared to healthy individuals.',
        question:'이 글에서 추론할 수 있는 것은?',
        options:['우울증은 오직 뇌의 문제이다','장내 세균은 소화에만 관여한다','장내 미생물 조절이 정신건강 치료에 활용될 수 있다','장-뇌 축은 단방향 통신이다'],
        answer:2, explanation:'장내 세균이 정신건강에 영향을 미치므로, 미생물 조절이 치료에 활용될 수 있음을 추론할 수 있습니다.' },

      // === 독해 지문 - 경제 ===
      { number:17, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'The concept of "nudging," popularized by behavioral economists Richard Thaler and Cass Sunstein, refers to designing choices in ways that guide people toward better decisions without restricting their freedom. For example, placing healthy food at eye level in a cafeteria is a nudge that encourages healthier eating. Unlike mandates or bans, nudges preserve individual autonomy while subtly steering behavior in beneficial directions.',
        question:'"nudge"의 핵심 특징은?',
        options:['강제로 행동을 제한한다','선택의 자유를 유지하면서 행동을 유도한다','경제적 인센티브를 제공한다','법률로 행동을 규제한다'],
        answer:1, explanation:'넛지는 자유를 제한하지 않으면서 더 나은 선택으로 유도하는 것입니다.' },

      // === 독해 지문 - 역사/문화 ===
      { number:18, type:'MULTIPLE_CHOICE', difficulty:'medium',
        passage:'The printing press, invented by Johannes Gutenberg around 1440, transformed European society by making books affordable and widely available. Before its invention, books were hand-copied by monks and were extremely expensive, limiting literacy to the wealthy and clergy. The printing press democratized knowledge, fueled the Renaissance, and played a key role in the Protestant Reformation by enabling the rapid spread of new ideas.',
        question:'이 글의 제목으로 가장 적절한 것은?',
        options:['구텐베르크의 생애','중세 수도원의 역할','인쇄술이 유럽 사회에 미친 영향','르네상스 예술의 발전'],
        answer:2, explanation:'인쇄술이 지식의 민주화, 르네상스, 종교개혁에 미친 영향을 다루고 있습니다.' },

      // === 어법 ===
      { number:19, type:'MULTIPLE_CHOICE', question:'다음 중 어법상 올바른 것은?', options:['He suggested that she goes home.','He suggested that she go home.','He suggested that she went home.','He suggested that she going home.'], answer:1, explanation:'suggest + that + S + 동사원형 (가정법 현재)', difficulty:'hard' },
      { number:20, type:'MULTIPLE_CHOICE', question:'"No sooner had I arrived ___ it started to rain."', options:['than','when','before','after'], answer:0, explanation:'No sooner ~ than: ~하자마자', difficulty:'hard' },
    ],

    // ────────── 수학 (수능/모의고사 기출 스타일) ──────────
    '수학': [
      // === 미적분 ===
      { number:1, type:'MULTIPLE_CHOICE', question:'lim(x→0) sinx/x = ?', options:['0','1','∞','존재하지 않음'], answer:1, explanation:'삼각함수의 극한: lim(x→0) sinx/x = 1', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'f(x)=x³-3x+2일 때 f\'(x)는?', options:['3x²-3','3x²-3x','x²-3','3x²+2'], answer:0, explanation:'(x³)\'=3x², (-3x)\'=-3, (2)\'=0', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'∫(2x+1)dx = ?', options:['x²+x+C','2x²+x+C','x²+C','2x+C'], answer:0, explanation:'∫2xdx=x², ∫1dx=x → x²+x+C', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'f(x)=x²-4x+3의 최솟값은?', options:['-1','0','1','3'], answer:0, explanation:'f(x)=(x-2)²-1, 최솟값=-1', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'정적분 ∫₀²(2x)dx = ?', options:['2','4','6','8'], answer:1, explanation:'[x²]₀²=4-0=4', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'함수 f(x)=x³-3x가 극대가 되는 x값은?', options:['x=-1','x=0','x=1','x=3'], answer:0, explanation:"f'(x)=3x²-3=0→x=±1, f''(-1)<0 → 극대", difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'lim(x→∞) (3x²+x)/(x²-1) = ?', options:['0','1','3','∞'], answer:2, explanation:'최고차항 계수의 비: 3/1=3', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'f(x)=eˣ일 때 f\'(x)는?', options:['xeˣ⁻¹','eˣ','eˣ+1','xe'], answer:1, explanation:'(eˣ)\'=eˣ', difficulty:'easy' },
      { number:9, type:'MULTIPLE_CHOICE', question:'∫₀¹ eˣ dx = ?', options:['e','e-1','e+1','1'], answer:1, explanation:'[eˣ]₀¹=e¹-e⁰=e-1', difficulty:'medium' },
      { number:10, type:'MULTIPLE_CHOICE', question:'f(x)=ln x일 때 f\'(x)는?', options:['x','1/x','ln x/x','1'], answer:1, explanation:'(ln x)\'=1/x', difficulty:'easy' },

      // === 수능 킬러 (고난도) ===
      { number:11, type:'MULTIPLE_CHOICE', question:'lim(x→0) (1-cosx)/x² = ?', options:['0','1/2','1','2'], answer:1, explanation:'로피탈 또는 반각 공식: (1-cosx)/x² → 1/2', difficulty:'hard' },
      { number:12, type:'MULTIPLE_CHOICE', question:'함수 f(x)=x⁴-4x³+6의 변곡점의 x좌표는?', options:['x=0, x=2','x=0, x=3','x=1, x=3','x=2, x=4'], answer:0, explanation:'f\'\'(x)=12x²-24x=12x(x-2)=0 → x=0, x=2', difficulty:'hard' },
      { number:13, type:'MULTIPLE_CHOICE', question:'∫₀^π sin²x dx = ?', options:['0','π/4','π/2','π'], answer:2, explanation:'sin²x=(1-cos2x)/2, 적분하면 π/2', difficulty:'hard' },
      { number:14, type:'MULTIPLE_CHOICE', question:'y=x²과 y=2x로 둘러싸인 영역의 넓이는?', options:['1/3','2/3','4/3','8/3'], answer:2, explanation:'교점 x=0,2. ∫₀²(2x-x²)dx=[x²-x³/3]₀²=4-8/3=4/3', difficulty:'hard' },

      // === 확률과 통계 ===
      { number:15, type:'MULTIPLE_CHOICE', question:'등차수열 2,5,8,11,...의 제20항은?', options:['56','59','62','65'], answer:1, explanation:'a₂₀=2+(20-1)×3=59', difficulty:'easy' },
      { number:16, type:'MULTIPLE_CHOICE', question:'₁₀C₃ = ?', options:['30','60','120','720'], answer:2, explanation:'10!/(3!×7!)=120', difficulty:'medium' },
      { number:17, type:'MULTIPLE_CHOICE', question:'5개 숫자 1,2,3,4,5로 만들 수 있는 3자리 수의 개수는? (중복 없음)', options:['30','60','120','125'], answer:1, explanation:'₅P₃=5×4×3=60', difficulty:'medium' },
      { number:18, type:'MULTIPLE_CHOICE', question:'등비수열 2,6,18,54,...의 제5항은?', options:['108','162','216','324'], answer:1, explanation:'a₅=2×3⁴=2×81=162', difficulty:'medium' },
      { number:19, type:'MULTIPLE_CHOICE', question:'주사위를 2번 던질 때 합이 7인 경우의 수는?', options:['4','5','6','7'], answer:2, explanation:'(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)=6가지', difficulty:'medium' },
      { number:20, type:'MULTIPLE_CHOICE', question:'정규분포 N(50,5²)에서 P(45≤X≤55)는 약?', options:['34.1%','68.3%','95.4%','99.7%'], answer:1, explanation:'평균±1σ 구간=약 68.3%', difficulty:'hard' },

      // === 수능 고난도 ===
      { number:21, type:'MULTIPLE_CHOICE', question:'등차수열 {aₙ}에서 a₃=7, a₇=19일 때, a₁₀은?', options:['25','28','31','34'], answer:1, explanation:'d=(19-7)/4=3, a₁=1, a₁₀=1+27=28', difficulty:'medium' },
      { number:22, type:'MULTIPLE_CHOICE', question:'함수 f(x)=2x³-9x²+12x의 극솟값은?', options:['0','3','4','5'], answer:2, explanation:'f\'=6x²-18x+12=0→x=1,2. f(2)=16-36+24=4', difficulty:'hard' },
      { number:23, type:'MULTIPLE_CHOICE', question:'Σ(k=1→n) k² = n(n+1)(2n+1)/6에서 Σ(k=1→10) k²은?', options:['285','330','385','440'], answer:2, explanation:'10×11×21/6=385', difficulty:'hard' },
      { number:24, type:'MULTIPLE_CHOICE', question:'방정식 log₃(x-1)+log₃(x+1)=2의 해는?', options:['x=√10','x=2','x=3','x=4'], answer:0, explanation:'log₃(x²-1)=2→x²-1=9→x²=10→x=√10', difficulty:'hard' },
      { number:25, type:'MULTIPLE_CHOICE', question:'∫₁ᵉ (1/x)dx = ?', options:['0','1','e','e-1'], answer:1, explanation:'[ln x]₁ᵉ=ln e-ln 1=1-0=1', difficulty:'medium' },

      { number:26, type:'SHORT_ANSWER', question:'f(x)=x³-3x+2일 때 f\'(x)를 구하세요.', answer:'3x²-3', explanation:'미분: 3x²-3', difficulty:'easy' },
      { number:27, type:'SHORT_ANSWER', question:'₁₀C₃의 값을 구하세요.', answer:'120', explanation:'10!/(3!×7!)=120', difficulty:'medium' },
      { number:28, type:'SHORT_ANSWER', question:'등비수열 2,6,18,...의 공비를 구하세요.', answer:'3', explanation:'r=6/2=3', difficulty:'easy' },
      { number:29, type:'SHORT_ANSWER', question:'lim(x→0) tanx/x의 값은?', answer:'1', explanation:'tanx/x=(sinx/cosx)/x=sinx/x × 1/cosx → 1×1=1', difficulty:'hard' },
      { number:30, type:'SHORT_ANSWER', question:'방정식 2ˣ=32의 해 x를 구하세요.', answer:'5', explanation:'2⁵=32 → x=5', difficulty:'medium' },
    ],
  },
}

// ════════════════════════════════════════
//  유틸리티
// ════════════════════════════════════════

/** 학년+과목에 해당하는 문제 풀 반환 (fallback 포함) */
export function getQuestions(grade: string, subject: string, difficulty?: Difficulty): Question[] {
  let pool: Question[] = []

  // 직접 매칭
  if (QUESTION_BANK[grade]?.[subject]) {
    pool = QUESTION_BANK[grade][subject]
  } else {
    // fallback: 같은 학교급의 가장 가까운 학년
    const prefix = grade.split('_')[0]
    const num = parseInt(grade.split('_')[1])
    const candidates = Object.keys(QUESTION_BANK).filter(k => k.startsWith(prefix))
    if (candidates.length > 0) {
      candidates.sort((a, b) =>
        Math.abs(parseInt(a.split('_')[1]) - num) - Math.abs(parseInt(b.split('_')[1]) - num)
      )
      if (QUESTION_BANK[candidates[0]]?.[subject]) {
        pool = QUESTION_BANK[candidates[0]][subject]
      }
    }
    // 최종 fallback
    if (pool.length === 0) {
      for (const g of Object.keys(QUESTION_BANK)) {
        if (QUESTION_BANK[g][subject]) { pool = QUESTION_BANK[g][subject]; break }
      }
    }
  }

  // 난이도 필터
  if (difficulty && difficulty !== 'all' as any) {
    const filtered = pool.filter(q => q.difficulty === difficulty)
    if (filtered.length > 0) return filtered
    // 필터 결과가 너무 적으면 전체 반환
  }

  return pool
}

/** Fisher-Yates 셔플 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const DIFFICULTY_LABEL: Record<Difficulty | 'all', string> = {
  all: '전체',
  easy: '기본',
  medium: '보통',
  hard: '심화',
}

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
}
