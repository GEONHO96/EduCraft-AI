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
    '코딩': [
      { number:1, type:'MULTIPLE_CHOICE', question:'컴퓨터에게 일을 시키는 명령어 모음을 무엇이라 할까요?', options:['프로그램','마우스','모니터','키보드'], answer:0, explanation:'프로그램은 컴퓨터에게 일을 시키는 명령어 모음입니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'스크래치에서 고양이를 오른쪽으로 10칸 움직이게 하려면?', options:['10만큼 움직이기','10번 반복하기','10초 기다리기','10도 돌기'], answer:0, explanation:'"10만큼 움직이기" 블록을 사용합니다.', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'같은 동작을 여러 번 반복하려면 어떤 블록을 쓸까요?', options:['만약~라면','반복하기','기다리기','멈추기'], answer:1, explanation:'반복하기 블록으로 같은 동작을 여러 번 실행합니다.', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"만약 비가 오면 우산을 가져간다"는 어떤 개념?', options:['반복','조건','변수','함수'], answer:1, explanation:'조건에 따라 다른 행동을 하는 것은 조건문입니다.', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'숫자를 저장하는 상자 같은 것을 프로그래밍에서 뭐라고 할까요?', options:['반복','조건','변수','출력'], answer:2, explanation:'변수는 값을 저장하는 이름 있는 공간입니다.', difficulty:'medium' },
      { number:6, type:'SHORT_ANSWER', question:'스크래치에서 "안녕!" 이라고 말하게 하는 블록 이름은?', answer:'말하기', explanation:'"~을(를) 말하기" 블록입니다.', difficulty:'easy' },
      { number:7, type:'MULTIPLE_CHOICE', question:'1,2,3,4,5를 차례로 출력하려면 어떻게 할까요?', options:['5번 반복하며 숫자 1씩 늘리기','5번 조건문 사용하기','5개의 변수 만들기','프로그램 5번 실행하기'], answer:0, explanation:'반복문과 변수를 활용하여 1씩 증가시키며 출력합니다.', difficulty:'hard' },
      { number:8, type:'MULTIPLE_CHOICE', question:'버그(Bug)란 무엇인가요?', options:['새로운 기능','프로그램의 오류','컴퓨터 바이러스','프로그래밍 언어'], answer:1, explanation:'버그는 프로그램에 있는 오류(실수)를 말합니다.', difficulty:'medium' },
      { number:9, type:'SHORT_ANSWER', question:'코딩에서 순서대로 명령을 나열하는 것을 무엇이라 하나요?', answer:'순차', explanation:'순차(sequence)는 명령을 순서대로 실행하는 것입니다.', difficulty:'easy' },
      { number:10, type:'MULTIPLE_CHOICE', question:'로봇에게 미로를 빠져나가게 하려면 어떤 개념들이 필요할까요?', options:['순차만','순차+반복','순차+조건+반복','조건만'], answer:2, explanation:'미로 탈출에는 순차, 조건(벽 확인), 반복(계속 이동)이 모두 필요합니다.', difficulty:'hard' },
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
    '코딩': [
      { number:1, type:'MULTIPLE_CHOICE', question:'스크래치에서 "10번 반복하기" 블록은 안의 코드를 몇 번 실행하나요?', options:['1번','5번','10번','무한번'], answer:2, explanation:'10번 반복하기는 안의 코드를 정확히 10번 실행합니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"변수 x를 5로 정하기" 후 x의 값은?', options:['0','3','5','10'], answer:2, explanation:'변수 x에 5를 저장했으므로 x=5입니다.', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'조건문 "만약 x>3이라면"에서 x가 2일 때 실행되나요?', options:['실행된다','실행 안 된다','오류가 난다','무한 반복한다'], answer:1, explanation:'2는 3보다 크지 않으므로 조건이 거짓이라 실행되지 않습니다.', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'알고리즘이란 무엇인가요?', options:['프로그래밍 언어','문제를 해결하는 절차','컴퓨터 부품','인터넷 주소'], answer:1, explanation:'알고리즘은 문제를 해결하기 위한 단계적 절차입니다.', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'x=3일 때, x=x+2를 실행하면 x는?', options:['3','2','5','6'], answer:2, explanation:'x+2=3+2=5이므로 x에 5가 저장됩니다.', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"10번 반복: x=x+1" 실행 후 x는? (초기 x=0)', options:['1','5','10','100'], answer:2, explanation:'0에서 시작해 1씩 10번 더하면 10입니다.', difficulty:'medium' },
      { number:7, type:'SHORT_ANSWER', question:'코딩에서 오류를 찾아 고치는 과정을 영어로 뭐라 하나요?', answer:'디버깅', explanation:'디버깅(Debugging)은 버그를 찾아 수정하는 과정입니다.', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'다음 중 입력(Input)에 해당하는 것은?', options:['화면에 글자 표시','키보드로 이름 입력','스피커에서 소리 출력','프린터로 인쇄'], answer:1, explanation:'키보드 입력은 컴퓨터에 데이터를 넣는 입력입니다.', difficulty:'easy' },
      { number:9, type:'MULTIPLE_CHOICE', question:'1부터 10까지 합을 구하려면?\nx=0, 반복(i=1~10): x=x+i\n결과 x는?', options:['10','45','55','100'], answer:2, explanation:'1+2+3+...+10 = 55', difficulty:'hard' },
      { number:10, type:'MULTIPLE_CHOICE', question:'엔트리에서 "만약~라면/아니면" 블록의 역할은?', options:['무조건 실행','조건이 참이면 A, 거짓이면 B 실행','두 가지를 동시에 실행','프로그램을 멈춤'], answer:1, explanation:'조건에 따라 다른 코드를 실행하는 if-else 구조입니다.', difficulty:'hard' },
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
    '코딩': [
      { number:1, type:'MULTIPLE_CHOICE', question:'Python에서 "Hello"를 출력하는 코드는?', options:['echo "Hello"','print("Hello")','printf("Hello")','cout << "Hello"'], answer:1, explanation:'Python에서는 print() 함수로 출력합니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'Python에서 변수 x에 10을 저장하는 코드는?', options:['var x = 10','int x = 10','x = 10','let x = 10'], answer:2, explanation:'Python은 x = 10으로 변수를 선언합니다.', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'Python: x = 7, y = 3일 때 x % y의 결과는?', options:['2','1','3','0'], answer:1, explanation:'% 는 나머지 연산자입니다. 7÷3=2...1', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'for i in range(5): 는 i가 어떻게 변하나요?', options:['1,2,3,4,5','0,1,2,3,4','0,1,2,3,4,5','1,2,3,4'], answer:1, explanation:'range(5)는 0부터 4까지 5개의 수를 생성합니다.', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'리스트 a = [10, 20, 30]에서 a[1]은?', options:['10','20','30','오류'], answer:1, explanation:'리스트 인덱스는 0부터 시작하므로 a[1]=20입니다.', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'HTML에서 글자를 굵게 만드는 태그는?', options:['<i>','<b>','<u>','<a>'], answer:1, explanation:'<b>는 bold(굵게) 태그입니다.', difficulty:'easy' },
      { number:7, type:'SHORT_ANSWER', question:'Python에서 "참"을 나타내는 값은? (영어 대문자로)', answer:'True', explanation:'Python에서 참은 True(첫 글자 대문자)입니다.', difficulty:'easy' },
      { number:8, type:'MULTIPLE_CHOICE', question:'다음 코드의 출력은?\nfor i in range(3):\n    print(i * 2)', options:['0 2 4','2 4 6','0 1 2','1 2 3'], answer:0, explanation:'i=0→0, i=1→2, i=2→4 출력', difficulty:'hard' },
      { number:9, type:'MULTIPLE_CHOICE', question:'함수(function)를 사용하는 가장 큰 이유는?', options:['프로그램을 느리게 하려고','같은 코드를 반복해서 쓰지 않으려고','변수를 많이 만들려고','오류를 만들려고'], answer:1, explanation:'함수는 코드 재사용을 위해 사용합니다.', difficulty:'medium' },
      { number:10, type:'MULTIPLE_CHOICE', question:'다음 코드의 결과는?\nresult = 0\nfor i in range(1, 6):\n    if i % 2 == 0:\n        result += i\nprint(result)', options:['6','9','15','10'], answer:0, explanation:'짝수만 더함: 2+4=6', difficulty:'hard' },
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
    '코딩': [
      { number:1, type:'MULTIPLE_CHOICE', question:'Python에서 리스트 [3,1,4,1,5]를 정렬하려면?', options:['sort([3,1,4,1,5])','[3,1,4,1,5].sort()','order([3,1,4,1,5])','[3,1,4,1,5].arrange()'], answer:1, explanation:'.sort() 메서드로 리스트를 정렬합니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'변수의 자료형 중 "문자열"은 영어로?', options:['int','float','string','bool'], answer:2, explanation:'문자열은 string(str)입니다.', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'Python: len("Hello")의 결과는?', options:['4','5','6','Hello'], answer:1, explanation:'len()은 문자열의 길이를 반환합니다. "Hello"는 5글자.', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'while문과 for문의 차이점은?', options:['while은 반복 못 함','for은 조건 반복 못 함','while은 조건 기반, for은 횟수/순회 기반','차이 없음'], answer:2, explanation:'while은 조건이 참인 동안, for은 정해진 횟수/컬렉션 순회에 적합합니다.', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'다음 코드의 출력은?\nx = "Python"\nprint(x[0:3])', options:['Pyt','Pyth','ython','Python'], answer:0, explanation:'슬라이싱: 인덱스 0~2까지 → "Pyt"', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'딕셔너리 d = {"name": "Kim", "age": 14}에서 d["age"]는?', options:['"Kim"','14','"age"','오류'], answer:1, explanation:'딕셔너리는 키로 값을 조회합니다. d["age"]=14', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'다음 함수의 반환값은?\ndef add(a, b):\n    return a + b\nprint(add(3, 7))', options:['37','10','(3,7)','오류'], answer:1, explanation:'add(3,7)은 3+7=10을 반환합니다.', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'HTML+CSS에서 글자 색상을 빨간색으로 바꾸는 CSS 속성은?', options:['background-color: red','font-size: red','color: red','text-align: red'], answer:2, explanation:'color 속성으로 글자 색상을 지정합니다.', difficulty:'easy' },
      { number:9, type:'MULTIPLE_CHOICE', question:'다음 코드의 출력은?\nnums = [1,2,3,4,5]\nresult = [x**2 for x in nums if x > 2]\nprint(result)', options:['[1,4,9,16,25]','[9,16,25]','[4,9,16,25]','[3,4,5]'], answer:1, explanation:'x>2인 것만 필터링(3,4,5) 후 제곱: [9,16,25]', difficulty:'hard' },
      { number:10, type:'MULTIPLE_CHOICE', question:'재귀함수란?', options:['반복문만 사용하는 함수','자기 자신을 호출하는 함수','입력이 없는 함수','한 번만 실행되는 함수'], answer:1, explanation:'재귀함수는 함수 내부에서 자기 자신을 다시 호출하는 함수입니다.', difficulty:'hard' },
    ],
  },

  // ══════════════════════════════════════════════
  //  중학교 3학년
  // ══════════════════════════════════════════════
  'MIDDLE_3': {
    '국어': [
      // ── 기본: 단순 용어/개념 확인 ──
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 "시적 화자"의 설명으로 옳은 것은?', options:['시를 쓴 작가','시 속에서 말하는 존재','시를 읽는 독자','시를 분석하는 비평가'], answer:1, explanation:'시적 화자 = 시 속에서 말하는 존재', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'논설문에서 "논거"란?', options:['글의 제목','주장을 뒷받침하는 근거','결론 요약','서론의 첫 문장'], answer:1, explanation:'논거 = 주장의 근거', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'소설의 3요소가 아닌 것은?', options:['인물','사건','배경','운율'], answer:3, explanation:'소설의 3요소: 인물, 사건, 배경. 운율은 시의 요소.', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"분사"의 종류 2가지는?', options:['현재분사, 과거분사','동명사, 부정사','능동, 피동','주격, 목적격'], answer:0, explanation:'분사: 현재분사(-ing), 과거분사(-ed/p.p.)', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'문학의 갈래 중 "서사"에 해당하는 것은?', options:['시','소설','수필','희곡'], answer:1, explanation:'서사 갈래: 소설, 신화, 전설 등', difficulty:'easy' },

      // ── 보통: 개념 적용/분석 필요 ──
      { number:6, type:'MULTIPLE_CHOICE', question:'"역설"의 의미는?', options:['같은 말 반복','겉과 속이 반대','모순 속에 진리','과장된 표현'], answer:2, explanation:'역설은 모순처럼 보이지만 깊은 진리를 담고 있습니다.', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"미디어 리터러시"란?', options:['미디어 기기 사용법','미디어 정보를 비판적으로 이해하는 능력','미디어 콘텐츠 제작 기술','SNS 활용법'], answer:1, explanation:'미디어 리터러시 = 미디어를 비판적으로 이해하고 활용하는 능력', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'"접속부사"의 기능으로 올바른 것은?\n① 그러나-역접  ② 그리고-나열  ③ 따라서-인과  ④ 즉-환언', options:['①만 맞다','①②만 맞다','①②③만 맞다','①②③④ 모두 맞다'], answer:3, explanation:'그러나(역접), 그리고(나열), 따라서(인과), 즉(환언) 모두 맞습니다.', difficulty:'medium' },
      { number:9, type:'SHORT_ANSWER', question:'형태소 "먹었다"를 분석하세요 (형태소 수).', answer:'3', explanation:'먹-(어근)+-었-(선어말어미)+-다(종결어미) = 3개', difficulty:'medium' },
      { number:10, type:'MULTIPLE_CHOICE', question:'"은유법"이 사용된 것은?', options:['"내 마음은 호수요"','"마치 거울 같은 호수"','"호수가 웃는다"','"호수는 매우 깊다"'], answer:0, explanation:'"A는 B이다" 형식의 은유법입니다. "마치~같은"은 직유법.', difficulty:'medium' },

      // ── 심화: 복합 추론/다단계 분석 ──
      { number:11, type:'MULTIPLE_CHOICE', question:'다음 중 "이중 모음"에 해당하지 않는 것은?', options:['ㅘ','ㅚ','ㅏ','ㅢ'], answer:2, explanation:'ㅏ는 단모음입니다. ㅘ(ㅗ+ㅏ), ㅚ(ㅗ+ㅣ), ㅢ(ㅡ+ㅣ)는 이중모음.', difficulty:'hard' },
      { number:12, type:'SHORT_ANSWER', question:'"봄이 오면 꽃이 핀다"에서 종속절을 쓰세요.', answer:'봄이 오면', explanation:'"봄이 오면"은 조건의 종속절(부사절)입니다.', difficulty:'hard' },
      { number:13, type:'MULTIPLE_CHOICE', question:'다음 중 "피동 표현"은?', options:['철수가 밥을 먹는다','꽃이 바람에 꺾였다','나는 학교에 간다','그는 노래를 부른다'], answer:1, explanation:'"꺾였다"는 피동 표현(-이-+었)입니다.', difficulty:'hard' },
      { number:14, type:'MULTIPLE_CHOICE', question:'"높다→높이, 넓다→넓이"에서 공통적으로 일어나는 단어 형성 방법은?', options:['합성','파생 (접미사)','준말 만들기','어근 교체'], answer:1, explanation:'형용사 어근 + 접미사 "-이"로 명사가 만들어지는 파생법입니다.', difficulty:'hard' },
      { number:15, type:'MULTIPLE_CHOICE', question:'"아침 이슬처럼 맑은 네 눈동자"에서 사용된 표현법을 모두 고르면?', options:['직유법만','직유법+은유법','직유법+영탄법','은유법+의인법'], answer:0, explanation:'"~처럼"은 직유법이며, 눈동자를 이슬에 비유한 것입니다.', difficulty:'hard' },
    ],
    '영어': [
      // ── 기본: 단어/기초 문법 ──
      { number:1, type:'MULTIPLE_CHOICE', question:'"The book ___ on the table when I came back."', options:['is','was','were','been'], answer:1, explanation:'과거 시점 → was', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"분사"의 종류 2가지는?', options:['현재분사, 과거분사','동명사, 부정사','능동, 피동','주격, 목적격'], answer:0, explanation:'분사: 현재분사(-ing), 과거분사(-ed/p.p.)', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"He ___ English for 5 years."', options:['study','studies','has studied','studied'], answer:2, explanation:'for 5 years → 현재완료(has studied)', difficulty:'easy' },
      { number:4, type:'SHORT_ANSWER', question:'"write"의 과거분사를 쓰세요.', answer:'written', explanation:'write-wrote-written', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"The man ___ is tall is my father." (관계대명사)', options:['who','which','what','whom'], answer:0, explanation:'사람 선행사 + 주격 관계대명사 = who', difficulty:'easy' },

      // ── 보통: 문법 적용 + 짧은 독해 ──
      { number:6, type:'MULTIPLE_CHOICE', question:'"I wish I ___ a bird."', options:['am','was','were','be'], answer:2, explanation:'가정법 과거: I wish + were', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"She asked me ___ I was from."', options:['what','where','who','which'], answer:1, explanation:'출신지를 묻는 간접의문문 → where', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', difficulty:'medium',
        passage:'Plastic pollution has become one of the most pressing environmental issues. Every year, approximately 8 million tons of plastic end up in the ocean, harming marine life and entering the food chain.',
        question:'이 글의 주제로 가장 적절한 것은?',
        options:['해양 생물의 종류','플라스틱 오염의 심각성','음식물 쓰레기 문제','재활용 방법'],
        answer:1, explanation:'매년 800만 톤의 플라스틱이 해양에 유입되는 오염 문제를 다룹니다.' },
      { number:9, type:'MULTIPLE_CHOICE', difficulty:'medium',
        passage:'The marshmallow experiment, conducted at Stanford University, tested children\'s ability to delay gratification. Children who waited for a second marshmallow were found to have better life outcomes years later.',
        question:'"delay gratification"의 의미로 적절한 것은?',
        options:['즉시 보상을 받는 것','만족을 지연시키는 것','보상을 거부하는 것','다른 사람에게 양보하는 것'],
        answer:1, explanation:'즉각적 보상을 참고 기다려 더 큰 보상을 얻는 것입니다.' },

      // ── 심화: 복합 문법 + 장문 독해 추론 ──
      { number:10, type:'MULTIPLE_CHOICE', question:'"If I had studied harder, I ___ the exam." (가정법 과거완료)', options:['will pass','would pass','would have passed','had passed'], answer:2, explanation:'가정법 과거완료: would have + p.p.', difficulty:'hard' },
      { number:11, type:'SHORT_ANSWER', question:'"too ~ to" 구문을 "so ~ that"으로 바꾸세요. "He is too young to drive."', answer:'He is so young that he cannot drive.', explanation:'too~to = so~that+cannot', difficulty:'hard' },
      { number:12, type:'MULTIPLE_CHOICE', question:'"Neither A nor B" 구문의 동사 수일치는?', options:['항상 단수','항상 복수','A에 일치','B에 일치'], answer:3, explanation:'Neither A nor B에서 동사는 B에 수일치', difficulty:'hard' },
      { number:13, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'The bystander effect suggests that individuals are less likely to offer help in an emergency when other people are present. The diffusion of responsibility means each bystander assumes someone else will act. Psychologists Darley and Latané demonstrated this after the murder of Kitty Genovese, where allegedly 38 witnesses failed to intervene. However, recent research has challenged the accuracy of the original account, suggesting that fewer witnesses were actually aware of the event.',
        question:'이 글의 내용과 일치하는 것은?',
        options:['방관자 효과는 최근에 반증되었다','38명의 목격자 이야기는 정확하지 않을 수 있다','사람이 많을수록 도움 행동이 증가한다','책임 분산은 긍정적 효과를 낳는다'],
        answer:1, explanation:'최근 연구가 원래 보고(38명 목격자)의 정확성에 의문을 제기했습니다.' },
      { number:14, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'Neuroplasticity refers to the brain\'s ability to reorganize itself by forming new neural connections throughout life. This ability is not limited to childhood; adults can also develop new skills and recover from brain injuries thanks to neuroplasticity. However, the rate of change decreases with age, making early intervention crucial for developmental disorders.',
        question:'빈칸에 가장 적절한 것은? "Neuroplasticity demonstrates that the brain is not ___ but can change throughout our lives."',
        options:['flexible','static','powerful','complex'],
        answer:1, explanation:'뇌가 고정적(static)이 아니라 변화할 수 있다는 것이 요지입니다.' },
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
    '코딩': [
      { number:1, type:'MULTIPLE_CHOICE', question:'Python에서 클래스를 정의할 때 사용하는 키워드는?', options:['def','class','struct','object'], answer:1, explanation:'class 키워드로 클래스를 정의합니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'다음 중 Python의 자료구조가 아닌 것은?', options:['list','tuple','dictionary','array'], answer:3, explanation:'Python 기본 자료구조는 list, tuple, dict, set입니다. array는 별도 모듈이 필요합니다.', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'시간 복잡도 O(n)이란?', options:['입력 크기와 상관없이 일정한 시간','입력 크기에 비례하는 시간','입력 크기의 제곱에 비례','로그에 비례하는 시간'], answer:1, explanation:'O(n)은 입력 크기 n에 비례하여 실행 시간이 증가합니다.', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'정렬 알고리즘 중 평균 시간복잡도가 O(n log n)인 것은?', options:['버블 정렬','선택 정렬','퀵 정렬','삽입 정렬'], answer:2, explanation:'퀵 정렬의 평균 시간복잡도는 O(n log n)입니다.', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'스택(Stack)의 특징은?', options:['선입선출(FIFO)','후입선출(LIFO)','랜덤 접근','양방향 접근'], answer:1, explanation:'스택은 나중에 넣은 것을 먼저 꺼내는 LIFO 구조입니다.', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'다음 코드의 출력은?\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\nprint(fib(6))', options:['5','8','13','21'], answer:1, explanation:'피보나치: 0,1,1,2,3,5,8 → fib(6)=8', difficulty:'hard' },
      { number:7, type:'MULTIPLE_CHOICE', question:'이진 탐색(Binary Search)의 전제 조건은?', options:['데이터가 정렬되어 있어야 한다','데이터가 짝수개여야 한다','리스트만 사용 가능하다','데이터가 10개 이상이어야 한다'], answer:0, explanation:'이진 탐색은 정렬된 데이터에서만 사용 가능합니다.', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'Git에서 변경사항을 저장하는 명령어는?', options:['git push','git commit','git pull','git clone'], answer:1, explanation:'git commit은 변경사항을 로컬 저장소에 저장합니다.', difficulty:'easy' },
      { number:9, type:'MULTIPLE_CHOICE', question:'다음 코드에서 result의 값은?\ndef solve(arr):\n    result = []\n    for x in arr:\n        if x not in result:\n            result.append(x)\n    return result\nprint(solve([1,2,2,3,3,3,4]))', options:['[1,2,3,4]','[1,2,2,3,3,3,4]','[2,3]','[1,4]'], answer:0, explanation:'중복을 제거하고 고유한 값만 남깁니다: [1,2,3,4]', difficulty:'hard' },
      { number:10, type:'SHORT_ANSWER', question:'10개의 정렬된 데이터에서 이진 탐색으로 값을 찾을 때 최대 비교 횟수는?', answer:'4', explanation:'⌈log₂10⌉ = 4번. 10→5→3→2→1', difficulty:'hard' },
    ],
  },

  // ══════════════════════════════════════════════
  //  고등학교 1학년
  // ══════════════════════════════════════════════
  'HIGH_1': {
    '국어': [
      // ── 기본: 단순 암기/용어 확인 ──
      { number:1, type:'MULTIPLE_CHOICE', question:'다음 중 "화법"에 해당하는 것은?', options:['글쓰기','발표와 토론','독서','문법 분석'], answer:1, explanation:'화법은 말하기와 듣기입니다.', difficulty:'easy' },
      { number:2, type:'SHORT_ANSWER', question:'비문학에서 두 대상의 공통점과 차이점을 제시하는 방법은?', answer:'비교와 대조', explanation:'비교(공통점)와 대조(차이점)', difficulty:'easy' },
      { number:3, type:'SHORT_ANSWER', question:'"윤동주"의 대표 시 제목을 쓰세요.', answer:'서시', explanation:'"죽는 날까지 하늘을 우러러..."', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'다음 중 현대시에서 "심상"의 종류가 아닌 것은?', options:['시각적 심상','청각적 심상','미각적 심상','논리적 심상'], answer:3, explanation:'심상은 감각적 이미지입니다. 논리적 심상은 없습니다.', difficulty:'easy' },

      // ── 보통: 개념 적용/분석 ──
      { number:5, type:'MULTIPLE_CHOICE', question:'"봄봄" (김유정)의 서술 시점은?', options:['1인칭 관찰자','1인칭 주인공','3인칭 전지적','3인칭 관찰자'], answer:1, explanation:'1인칭 주인공 시점으로 "나"가 직접 겪는 이야기입니다.', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'"갈래"에 따른 문학 분류에서, "수필"이 속하는 갈래는?', options:['서정','서사','교술','극'], answer:2, explanation:'수필은 교술 갈래입니다.', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'다음 중 "매체 언어"의 특성이 아닌 것은?', options:['복합 양식성','상호작용성','일방향성','즉시성'], answer:2, explanation:'매체 언어는 쌍방향적(상호작용적)입니다.', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'"은유법"과 "직유법"의 차이는?', options:['은유는 "A는 B다", 직유는 "A는 B같다"','둘 다 같은 표현법이다','직유는 과장법의 일종이다','은유는 산문에서만 쓴다'], answer:0, explanation:'은유법은 직접 동일시(A=B), 직유법은 비교 표지 사용(~처럼, ~같이).', difficulty:'medium' },
      { number:9, type:'SHORT_ANSWER', question:'문학의 기능 중, 독자에게 즐거움을 주는 기능은?', answer:'쾌락적 기능', explanation:'문학의 기능: 쾌락적, 교훈적, 인식적', difficulty:'medium' },

      // ── 심화: 다단계 분석/적용 ──
      { number:10, type:'MULTIPLE_CHOICE', question:'다음 중 음운 변동의 예로 올바른 것은?', options:['"국물"→[궁물]은 비음화','"같이"→[가치]는 구개음화','"꽃잎"→[꼰닙]은 된소리되기','"밥물"→[밤물]은 유음화'], answer:0, explanation:'ㄱ+ㅁ→ㅇ+ㅁ 비음화. "같이"→[가치]는 구개음화가 맞음.', difficulty:'hard' },
      { number:11, type:'MULTIPLE_CHOICE', question:'다음 형태소 분석에서 "먹었다"의 형태소 개수는?', options:['1개','2개','3개','4개'], answer:2, explanation:'먹-(어근)+-었-(선어말어미)+-다(종결어미) = 3개', difficulty:'hard' },
      { number:12, type:'MULTIPLE_CHOICE', question:'"같이"→[가치]에서 일어나는 음운 변동은?', options:['비음화','유음화','구개음화','된소리되기'], answer:2, explanation:'ㄱ+이→ㅈ+이 구개음화(형태소 경계에서 ㄷ,ㅌ이 ㅈ,ㅊ으로 변함). "같이"의 경우 ㅌ→ㅊ.', difficulty:'hard' },
      { number:13, type:'MULTIPLE_CHOICE', question:'"사랑하는 나의 하나님, 당신은 / 늙은 비애다"(서정주)에서 사용된 표현법을 모두 고르면?', options:['직유법만','은유법만','은유법+도치법','직유법+역설법'], answer:2, explanation:'"하나님=늙은 비애"는 은유법, "사랑하는~당신은"이 도치된 구조입니다.', difficulty:'hard' },
      { number:14, type:'MULTIPLE_CHOICE', question:'"놀부전"에서 놀부가 박을 타자 재앙이 쏟아지는 장면의 기능은?', options:['단순 재미','인과응보의 주제 강화','시간적 배경 제시','인물 심리 묘사'], answer:1, explanation:'탐욕에 대한 징벌로 인과응보 주제를 강화하는 기능입니다.', difficulty:'hard' },
    ],
    '영어': [
      // ── 기본: 핵심 문법/어휘 확인 ──
      { number:1, type:'MULTIPLE_CHOICE', question:'"Not only A but also B"의 뜻은?', options:['A뿐만 아니라 B도','A가 아니라 B','A 또는 B','A와 B 둘 다 아닌'], answer:0, explanation:'A뿐만 아니라 B도', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'관계부사 "where"을 쓸 수 있는 선행사는?', options:['시간','장소','이유','방법'], answer:1, explanation:'where = 장소 선행사', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"If I ___ rich, I would travel the world."', options:['am','was','were','be'], answer:2, explanation:'가정법 과거: were (be동사는 주어에 관계없이 were)', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'"분사구문"이란?', options:['명사를 수식하는 구문','부사절을 줄인 구문','형용사를 강조하는 구문','의문문을 만드는 구문'], answer:1, explanation:'분사구문 = 부사절 축약', difficulty:'easy' },

      // ── 보통: 문법 적용 + 짧은 독해 ──
      { number:5, type:'MULTIPLE_CHOICE', question:'"The building ___ in 1990."', options:['built','was built','is built','has built'], answer:1, explanation:'수동태 과거: was built', difficulty:'medium' },
      { number:6, type:'SHORT_ANSWER', question:'"She has been studying for 3 hours."의 시제를 쓰세요.', answer:'현재완료진행', explanation:'has been ~ing = 현재완료진행', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', difficulty:'medium',
        passage:'Sleep plays a crucial role in memory consolidation. During deep sleep, the brain replays experiences from the day, strengthening neural connections and transferring information from short-term to long-term memory.',
        question:'이 글에 따르면 깊은 수면 중 뇌는 무엇을 하는가?',
        options:['새로운 정보를 학습한다','낮의 경험을 재생하며 기억을 강화한다','단기 기억을 삭제한다','운동 능력을 향상시킨다'],
        answer:1, explanation:'깊은 수면 중 뇌가 경험을 재생(replay)하며 기억을 강화합니다.' },
      { number:8, type:'MULTIPLE_CHOICE', difficulty:'medium',
        passage:'The anchoring effect is a cognitive bias where people rely too heavily on the first piece of information they encounter. For example, if a shirt is initially priced at $100 but marked down to $50, people perceive it as a better deal than if it had always been priced at $50.',
        question:'"anchoring effect"의 핵심은?',
        options:['첫 번째 정보가 이후 판단에 과도한 영향을 미침','가격이 낮을수록 좋은 거래','사람들은 항상 합리적 판단을 함','할인은 항상 좋은 것'],
        answer:0, explanation:'처음 접한 정보(앵커)가 이후 판단에 과도한 영향을 미치는 인지 편향입니다.' },

      // ── 심화: 복합 문법 + 장문 독해 ──
      { number:9, type:'MULTIPLE_CHOICE', question:'"I regret ___ that." (과거의 행동 후회)', options:['say','to say','saying','said'], answer:2, explanation:'regret + ~ing = 과거 행동 후회 / regret + to = 지금 유감', difficulty:'hard' },
      { number:10, type:'MULTIPLE_CHOICE', question:'5형식 "I found the book interesting."에서 interesting의 역할은?', options:['주어','목적어','목적격 보어','부사'], answer:2, explanation:'S+V+O+OC → interesting = 목적격 보어', difficulty:'hard' },
      { number:11, type:'SHORT_ANSWER', question:'"가정법 현재: It is important that he ___ hard." 빈칸을 쓰세요.', answer:'study', explanation:'that절에서 동사원형 사용 (가정법 현재)', difficulty:'hard' },
      { number:12, type:'SHORT_ANSWER', question:'"강조구문: I met Tom yesterday."에서 Tom을 강조하세요.', answer:'It is Tom that I met yesterday.', explanation:'It is/was ~ that 강조구문', difficulty:'hard' },
      { number:13, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'The Flynn effect describes the substantial and sustained increase in IQ scores throughout the 20th century. However, recent studies in some countries suggest that this trend may be reversing. Possible explanations include changes in education systems, nutrition, and the increasing influence of technology on cognitive development. Some researchers argue that while certain types of intelligence are declining, others—particularly those related to technology use—may be increasing.',
        question:'이 글을 통해 추론할 수 있는 것은?',
        options:['IQ 점수는 항상 상승한다','플린 효과는 모든 나라에서 역전되었다','지능의 유형에 따라 변화 양상이 다를 수 있다','기술 발전은 모든 유형의 지능을 감소시킨다'],
        answer:2, explanation:'일부 지능은 감소하고 기술 관련 지능은 증가할 수 있다는 내용입니다.' },
      { number:14, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'Social loafing occurs when individuals put in less effort when working in a group compared to working alone. This phenomenon increases with group size and decreases when individual contributions are identifiable. Strategies to reduce social loafing include making tasks more engaging, assigning specific responsibilities, and establishing accountability mechanisms.',
        question:'빈칸에 적절한 것은? "Social loafing can be reduced when individual contributions are ___."',
        options:['anonymous','ignored','identifiable','equal'],
        answer:2, explanation:'개인의 기여가 식별 가능(identifiable)할 때 사회적 태만이 줄어듭니다.' },
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
    '코딩': [
      { number:1, type:'MULTIPLE_CHOICE', question:'Python에서 예외 처리에 사용하는 구문은?', options:['if-else','for-in','try-except','while-do'], answer:2, explanation:'try-except 구문으로 예외를 처리합니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'객체지향 프로그래밍(OOP)의 4대 특성이 아닌 것은?', options:['캡슐화','상속','다형성','반복성'], answer:3, explanation:'OOP 4대 특성: 캡슐화, 상속, 다형성, 추상화', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'배열 [5,3,8,1,9,2]를 버블 정렬 1회전 후 가장 뒤로 가는 값은?', options:['5','9','2','8'], answer:1, explanation:'버블 정렬 1회전에서 가장 큰 값 9가 맨 뒤로 이동합니다.', difficulty:'medium' },
      { number:4, type:'MULTIPLE_CHOICE', question:'자바스크립트에서 === 과 == 의 차이는?', options:['같은 의미','===는 타입까지 비교, ==는 값만 비교','===는 값만, ==는 타입까지','문법 오류'], answer:1, explanation:'===는 엄격 비교(타입+값), ==는 느슨한 비교(값만)입니다.', difficulty:'medium' },
      { number:5, type:'MULTIPLE_CHOICE', question:'연결 리스트(Linked List)와 배열(Array)의 차이로 틀린 것은?', options:['배열은 인덱스로 O(1) 접근','연결 리스트는 삽입/삭제가 O(1)','배열은 크기가 고정적','연결 리스트는 인덱스 접근이 O(1)'], answer:3, explanation:'연결 리스트는 순차 접근이라 인덱스 접근이 O(n)입니다.', difficulty:'medium' },
      { number:6, type:'MULTIPLE_CHOICE', question:'다음 코드의 시간 복잡도는?\nfor i in range(n):\n    for j in range(n):\n        print(i, j)', options:['O(n)','O(n log n)','O(n²)','O(2ⁿ)'], answer:2, explanation:'이중 반복문으로 n×n번 실행 → O(n²)', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'다음 코드의 결과는?\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f"{self.name}: 멍멍!"\nd = Dog("바둑이")\nprint(d.bark())', options:['"멍멍!"','"바둑이"','"바둑이: 멍멍!"','오류'], answer:2, explanation:'self.name="바둑이"이므로 "바둑이: 멍멍!" 출력', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'HTTP 상태 코드 404는 무엇을 의미하나요?', options:['요청 성공','서버 오류','페이지를 찾을 수 없음','권한 없음'], answer:2, explanation:'404 = Not Found (페이지를 찾을 수 없음)', difficulty:'easy' },
      { number:9, type:'MULTIPLE_CHOICE', question:'BFS(너비 우선 탐색)에서 사용하는 자료구조는?', options:['스택','큐','힙','트리'], answer:1, explanation:'BFS는 큐(Queue)를 사용하여 너비 우선으로 탐색합니다.', difficulty:'hard' },
      { number:10, type:'MULTIPLE_CHOICE', question:'다음 코드의 출력은?\ndef merge_sort_count(arr):\n    if len(arr) <= 1: return arr, 0\n    mid = len(arr)//2\n    left, lc = merge_sort_count(arr[:mid])\n    right, rc = merge_sort_count(arr[mid:])\n    # merge 과정 생략...\nprint(merge_sort_count([3,1,4,1,5])[1])\n이 코드에서 분할(divide)이 일어나는 최대 깊이는?', options:['1','2','3','4'], answer:2, explanation:'5→(3,2)→(2,1)(1,1)→(1,1) 최대 깊이 3단계', difficulty:'hard' },
      { number:11, type:'MULTIPLE_CHOICE', question:'동적 프로그래밍(DP)을 사용하는 가장 큰 이유는?', options:['코드가 짧아서','중복 계산을 피하기 위해','메모리를 많이 쓰기 위해','정렬을 위해'], answer:1, explanation:'DP는 중복되는 부분 문제의 결과를 저장하여 재계산을 방지합니다.', difficulty:'hard' },
      { number:12, type:'SHORT_ANSWER', question:'시간 복잡도에서 O(1)은 무엇을 의미하나요?', answer:'상수 시간', explanation:'O(1)은 입력 크기에 관계없이 일정한 시간이 걸립니다.', difficulty:'easy' },
    ],
  },

  // ══════════════════════════════════════════════
  //  고등학교 3학년 (수능 대비) — 난이도 확실히 차등
  //  easy = 개념 확인/공식 대입 1단계
  //  medium = 2~3단계 풀이, 분석 필요
  //  hard = 수능 킬러급 4단계+, 복합 추론
  // ══════════════════════════════════════════════
  'HIGH_3': {
    '국어': [
      // ── 기본: 단순 암기/개념 확인 ──
      { number:1, type:'MULTIPLE_CHOICE', question:'"홍길동전"의 작가는?', options:['김시습','허균','박지원','정약용'], answer:1, explanation:'허균 작, 최초의 한글 소설', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'비문학에서 "역접" 접속어는?', options:['그리고','따라서','하지만','예를 들어'], answer:2, explanation:'"하지만"은 역접 접속어입니다.', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'시조의 형식은?', options:['초장-중장-종장','서론-본론-결론','기-승-전-결','발단-전개-위기-절정-결말'], answer:0, explanation:'시조는 초장-중장-종장 3장 구조입니다.', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'김소월 "진달래꽃"의 정서는?', options:['기쁨','분노','이별의 슬픔','공포'], answer:2, explanation:'임과의 이별을 노래한 시입니다.', difficulty:'easy' },
      { number:5, type:'SHORT_ANSWER', question:'"형태소"의 정의를 쓰세요.', answer:'뜻을 가진 가장 작은 단위', explanation:'형태소 = 의미의 최소 단위', difficulty:'easy' },

      // ── 보통: 개념 적용, 분석 필요 ──
      { number:6, type:'MULTIPLE_CHOICE', question:'다음 중 "음운의 축약"에 해당하는 것은?', options:['놓다→[노타]','국물→[궁물]','굳이→[구지]','좋다→[조타]'], answer:3, explanation:'ㅎ+ㄷ→ㅌ 거센소리되기(축약)', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"사미인곡"(정철)에 나타난 표현법은?', options:['직유법','풍자','충신연주지사(임금을 연인에 비유)','역설법'], answer:2, explanation:'임금에 대한 그리움을 연인과의 이별로 비유한 충신연주지사입니다.', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'"먹었다"의 형태소 분석으로 올바른 것은?', options:['먹었다(1개)','먹-+-었다(2개)','먹-+-었-+-다(3개)','ㅁ-+-ㅓ-+-ㄱ-+-었-+-다(5개)'], answer:2, explanation:'먹-(어근)+-었-(선어말어미)+-다(종결어미) = 3개', difficulty:'medium' },
      { number:9, type:'MULTIPLE_CHOICE', question:'수능 비문학에서 "전제"와 "결론"의 관계는?', options:['전제가 결론을 뒷받침한다','결론이 전제를 부정한다','전제와 결론은 무관하다','전제가 결론보다 먼저 나올 수 없다'], answer:0, explanation:'논증에서 전제는 결론을 뒷받침하는 근거입니다.', difficulty:'medium' },
      { number:10, type:'SHORT_ANSWER', question:'"님의 침묵"(한용운)에서 "님"이 상징하는 대상 2가지를 쓰세요.', answer:'조국, 부처', explanation:'"님"은 조국, 부처(절대적 가치) 등 다의적 상징입니다.', difficulty:'medium' },

      // ── 심화: 수능 실전형 복합 문제 ──
      { number:11, type:'MULTIPLE_CHOICE', question:'다음 중 <보기>의 음운 변동이 모두 일어나는 단어는?\n<보기> 비음화, 된소리되기', options:['국물[궁물]','법도[법또]','한글[한글]','닭볶음탕[닥뽁끔탕]'], answer:3, explanation:'"닭볶음탕"에서 ㄺ→ㄱ(자음군단순화), ㄱ+ㅂ→ㅇ+ㅂ(비음화), ㅂ+ㄱ→ㅂ+ㄲ(된소리되기) 모두 일어납니다.', difficulty:'hard' },
      { number:12, type:'MULTIPLE_CHOICE', question:'<보기>를 참고할 때, "이 몸이 죽고 죽어 일백 번 고쳐 죽어"(정몽주)에서 화자의 태도와 가장 유사한 것은?', options:['"장진주사" - 술을 마시며 인생을 즐기자','"도산십이곡" - 학문에 정진하자','"단심가" - 충절을 끝까지 지키겠다','"만흥" - 자연 속에서 한가로이 살자'], answer:2, explanation:'정몽주의 단심가와 같이 죽어도 변치 않는 충절을 노래합니다.', difficulty:'hard' },
      { number:13, type:'MULTIPLE_CHOICE', question:'수능 언어 <보기>: "용언의 활용에서 어간의 끝소리가 바뀌는 것을 불규칙 활용이라 한다." 다음 중 불규칙 활용이 아닌 것은?', options:['돕다→도와','걷다→걸어','먹다→먹어','짓다→지어'], answer:2, explanation:'"먹다→먹어"는 어간 "먹-"이 변하지 않는 규칙 활용입니다.', difficulty:'hard' },
      { number:14, type:'MULTIPLE_CHOICE', question:'수능 비문학: 어떤 과학 이론이 "반증 가능성"을 갖추어야 과학적이라고 주장한 학자는?', options:['토머스 쿤','칼 포퍼','임레 라카토슈','폴 파이어아벤트'], answer:1, explanation:'칼 포퍼의 반증주의: 과학 이론은 경험적으로 반증 가능해야 합니다.', difficulty:'hard' },
      { number:15, type:'SHORT_ANSWER', question:'수능 문학에서 "내적 준거"와 "외적 준거" 감상의 차이를 간단히 쓰세요.', answer:'내적 준거는 작품 자체의 요소로, 외적 준거는 작품 밖 맥락으로 감상', explanation:'내적: 작품 구조/표현 분석 / 외적: 작가론, 반영론, 수용론 등', difficulty:'hard' },
    ],

    // ────────── 영어 (난이도별 확실히 차등) ──────────
    '영어': [
      // ── 기본: 단어 뜻, 기초 문법 ──
      { number:1, type:'MULTIPLE_CHOICE', question:'"regardless of"의 뜻은?', options:['~때문에','~에 관계없이','~에 따라','~덕분에'], answer:1, explanation:'regardless of = ~에 상관없이', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'"alternative"의 뜻은?', options:['대안, 대체의','최종적인','전통적인','필수적인'], answer:0, explanation:'alternative = 대안의, 대체 가능한', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'"on the whole"의 뜻은?', options:['특히','전체적으로','예를 들어','반대로'], answer:1, explanation:'on the whole = 전체적으로, 대체로', difficulty:'easy' },
      { number:4, type:'SHORT_ANSWER', question:'"as a result"의 뜻을 쓰세요.', answer:'결과적으로', explanation:'as a result = 그 결과', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'"The meeting was canceled ___ the storm."', options:['because','due to','although','despite'], answer:1, explanation:'due to + 명사 = ~때문에', difficulty:'easy' },

      // ── 보통: 문법 적용, 짧은 독해 ──
      { number:6, type:'MULTIPLE_CHOICE', question:'"Had I known the truth, I would have acted differently." 이 문장의 문법은?', options:['가정법 과거','가정법 과거완료','가정법 미래','직설법 과거'], answer:1, explanation:'Had+S+p.p. → 가정법 과거완료 도치 구문', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'"No sooner had I arrived ___ it started to rain."', options:['than','when','before','after'], answer:0, explanation:'No sooner ~ than = ~하자마자', difficulty:'medium' },
      { number:8, type:'SHORT_ANSWER', question:'"The more you practice, the better you become."의 문법 구조는?', answer:'the 비교급 the 비교급', explanation:'"~할수록 더 ~하다" 구문', difficulty:'medium' },

      { number:9, type:'MULTIPLE_CHOICE', difficulty:'medium',
        passage:'The printing press, invented by Johannes Gutenberg around 1440, transformed European society by making books affordable and widely available. Before its invention, books were hand-copied by monks and were extremely expensive. The printing press democratized knowledge, fueled the Renaissance, and played a key role in the Protestant Reformation.',
        question:'이 글의 주제로 가장 적절한 것은?',
        options:['구텐베르크의 생애','중세 수도원의 역할','인쇄술이 유럽 사회에 미친 영향','르네상스 예술의 발전'],
        answer:2, explanation:'인쇄술이 지식 민주화, 르네상스, 종교개혁에 미친 영향을 다룹니다.' },

      { number:10, type:'MULTIPLE_CHOICE', difficulty:'medium',
        passage:'The Dunning-Kruger effect is a cognitive bias in which people with limited competence overestimate their own ability. Conversely, experts tend to underestimate their competence, assuming that tasks easy for them are easy for everyone.',
        question:'전문가들은 어떤 경향이 있는가?',
        options:['자신의 능력을 과대평가한다','자신의 능력을 과소평가한다','다른 사람을 무시한다','자신감이 매우 높다'],
        answer:1, explanation:'전문가는 자신에게 쉬운 것이 모두에게 쉽다고 가정하여 과소평가합니다.' },

      // ── 심화: 수능 31~34번 스타일 (빈칸추론, 복합추론) ──
      { number:11, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'When people face an overwhelming number of choices, they often experience what psychologist Barry Schwartz calls "the paradox of choice." Rather than feeling liberated by abundant options, individuals become paralyzed by indecision, fearing they will make the wrong selection. After finally choosing, they frequently experience regret, wondering whether a different option would have been better. Paradoxically, reducing the number of available choices often leads to greater satisfaction with the chosen option.',
        question:'빈칸에 가장 적절한 것은? "The paradox of choice demonstrates that having more options does not necessarily lead to ___."',
        options:['higher prices','better decisions','greater happiness','increased productivity'],
        answer:2, explanation:'선택지가 많을수록 오히려 만족감이 떨어진다는 역설이므로, 더 많은 선택이 "더 큰 행복"으로 이어지지 않는다는 의미입니다.' },

      { number:12, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'In ecology, the concept of a "trophic cascade" describes how changes at the top of a food chain can dramatically alter an entire ecosystem. When wolves were reintroduced to Yellowstone National Park in 1995, they reduced the elk population, which had been overgrazing riverside vegetation. As the vegetation recovered, riverbanks stabilized, songbird populations returned, and even the physical course of rivers changed. This interconnected chain of effects illustrates how a single species can reshape an entire landscape through indirect ecological interactions.',
        question:'이 글을 통해 추론할 수 있는 것으로 가장 적절한 것은?',
        options:['늑대는 초식동물만 직접 영향을 미친다','생태계의 상위 포식자 제거는 하위 요소에도 연쇄적 영향을 미친다','강의 흐름은 식물과 무관하다','엘크 개체수가 줄면 생태계가 파괴된다'],
        answer:1, explanation:'영양 단계 폭포 효과: 상위 포식자의 변화가 식물, 새, 심지어 지형까지 연쇄적으로 영향을 미칩니다.' },

      { number:13, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'The sunk cost fallacy occurs when people continue investing in something because of previously invested resources, rather than evaluating the future value of the investment. A company might continue funding a failing project because it has already spent millions on it, even though cutting losses would be the rational choice. Similarly, a person might sit through a terrible movie simply because they paid for the ticket. The fallacy lies in treating irrecoverable past costs as relevant to decisions about the future.',
        question:'밑줄 친 "treating irrecoverable past costs as relevant to decisions about the future"가 의미하는 것으로 가장 적절한 것은?',
        options:['미래 투자의 수익성을 분석하는 것','회수 불가능한 과거 비용을 미래 결정의 근거로 삼는 비합리적 행동','과거의 실수에서 교훈을 얻는 합리적 판단','손실을 최소화하기 위한 전략적 투자'],
        answer:1, explanation:'이미 회수할 수 없는 과거의 비용(매몰 비용)을 미래 의사결정에 반영하는 비합리적 경향을 말합니다.' },

      { number:14, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'Scientists have long debated whether language shapes thought or merely reflects it. The strong version of the Sapir-Whorf hypothesis suggests that the language we speak fundamentally determines how we perceive reality. For instance, the Hopi language lacks grammatical tenses for past and future, leading some researchers to argue that Hopi speakers perceive time differently. However, more recent evidence suggests a weaker version: while language does not determine thought, it can influence certain cognitive processes, such as color perception and spatial reasoning.',
        question:'이 글의 요지로 가장 적절한 것은?',
        options:['언어는 사고를 완전히 결정한다','모든 언어는 동일한 인지 구조를 반영한다','언어가 사고를 결정하지는 않지만 일부 인지 과정에 영향을 줄 수 있다','호피어를 사용하는 사람은 시간 개념이 없다'],
        answer:2, explanation:'강한 가설(결정)은 약화되었지만, 약한 버전(영향)은 지지됩니다.' },

      { number:15, type:'MULTIPLE_CHOICE', difficulty:'hard',
        passage:'Confirmation bias is the tendency to search for, interpret, and recall information in a way that confirms one\'s preexisting beliefs. In the age of social media algorithms, this bias is amplified through "filter bubbles" that expose users primarily to content aligning with their existing views. This creates an illusion of consensus, where individuals mistakenly believe their perspective is universally shared, further entrenching polarization.',
        question:'다음 문장이 들어갈 위치로 가장 적절한 곳은? "As a result, people become less likely to encounter or seriously consider opposing viewpoints."',
        options:['첫 번째 문장 뒤','두 번째 문장 뒤','세 번째 문장 뒤','마지막 문장 뒤'],
        answer:1, explanation:'필터 버블이 기존 관점의 콘텐츠만 보여준다는 내용 뒤에, 그 결과 반대 의견을 접하기 어렵다는 문장이 자연스럽습니다.' },

      { number:16, type:'MULTIPLE_CHOICE', question:'다음 중 어법상 올바른 것은?', options:['He suggested that she goes home.','He suggested that she go home.','He suggested that she went home.','He suggested that she going home.'], answer:1, explanation:'suggest + that + S + 동사원형 (가정법 현재)', difficulty:'hard' },
      { number:17, type:'MULTIPLE_CHOICE', question:'"A is to B what C is to D"를 올바르게 해석한 것은?', options:['A는 B보다 C만큼 크다','A와 B의 관계는 C와 D의 관계와 같다','A가 B라면 C도 D이다','A에서 B를 빼면 C에서 D를 뺀 것과 같다'], answer:1, explanation:'비례 관계: A:B = C:D', difficulty:'hard' },
    ],

    // ────────── 수학 (난이도별 확실히 차등) ──────────
    '수학': [
      // ── 기본: 공식 대입 한 번이면 끝 ──
      { number:1, type:'MULTIPLE_CHOICE', question:'f(x)=x³일 때 f\'(x)는?', options:['x²','3x','3x²','x³'], answer:2, explanation:'(xⁿ)\'=nxⁿ⁻¹ → 3x²', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'log₂8 = ?', options:['2','3','4','8'], answer:1, explanation:'2³=8 → log₂8=3', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'등차수열 2,5,8,11,...의 공차는?', options:['2','3','5','8'], answer:1, explanation:'5-2=3', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'sin30° = ?', options:['0','1/2','√2/2','√3/2'], answer:1, explanation:'sin30°=1/2 (기본 삼각비)', difficulty:'easy' },
      { number:5, type:'MULTIPLE_CHOICE', question:'(eˣ)\' = ?', options:['xeˣ⁻¹','eˣ','eˣ+1','1/eˣ'], answer:1, explanation:'지수함수의 미분: (eˣ)\'=eˣ', difficulty:'easy' },
      { number:6, type:'SHORT_ANSWER', question:'2⁵ = ?', answer:'32', explanation:'2×2×2×2×2=32', difficulty:'easy' },
      { number:7, type:'SHORT_ANSWER', question:'등비수열 2,6,18,...의 공비는?', answer:'3', explanation:'6/2=3', difficulty:'easy' },

      // ── 보통: 2~3단계 풀이 ──
      { number:8, type:'MULTIPLE_CHOICE', question:'f(x)=x²-4x+3의 최솟값은?', options:['-1','0','1','3'], answer:0, explanation:'f(x)=(x-2)²-1 → 꼭짓점(2,-1), 최솟값=-1', difficulty:'medium' },
      { number:9, type:'MULTIPLE_CHOICE', question:'정적분 ∫₀²(2x)dx = ?', options:['2','4','6','8'], answer:1, explanation:'∫2xdx=x² → [x²]₀²=4-0=4', difficulty:'medium' },
      { number:10, type:'MULTIPLE_CHOICE', question:'등차수열 {aₙ}에서 a₃=7, a₇=19일 때, 공차 d는?', options:['2','3','4','6'], answer:1, explanation:'a₇-a₃=4d=12 → d=3', difficulty:'medium' },
      { number:11, type:'MULTIPLE_CHOICE', question:'₁₀C₃ = ?', options:['30','60','120','720'], answer:2, explanation:'10!/(3!×7!) = (10×9×8)/(3×2×1) = 120', difficulty:'medium' },
      { number:12, type:'MULTIPLE_CHOICE', question:'lim(x→∞) (3x²+x)/(x²-1) = ?', options:['0','1','3','∞'], answer:2, explanation:'최고차항의 계수의 비: 3/1=3', difficulty:'medium' },
      { number:13, type:'MULTIPLE_CHOICE', question:'함수 f(x)=x³-3x의 극대가 되는 x값은?', options:['x=-1','x=0','x=1','x=3'], answer:0, explanation:"f'(x)=3x²-3=0→x=±1. f''(-1)=-6<0→극대", difficulty:'medium' },
      { number:14, type:'MULTIPLE_CHOICE', question:'∫₁ᵉ (1/x)dx = ?', options:['0','1','e','e-1'], answer:1, explanation:'[ln|x|]₁ᵉ = lne - ln1 = 1-0 = 1', difficulty:'medium' },
      { number:15, type:'SHORT_ANSWER', question:'₅P₃의 값은?', answer:'60', explanation:'5×4×3=60', difficulty:'medium' },
      { number:16, type:'SHORT_ANSWER', question:'x²-6x+k=0이 중근을 가지려면 k는?', answer:'9', explanation:'판별식 D=36-4k=0 → k=9', difficulty:'medium' },

      // ── 심화: 수능 킬러 (22번·30번급) 복합·다단계 ──
      { number:17, type:'MULTIPLE_CHOICE', question:'함수 f(x)=x⁴-8x²+12에서 극솟값을 모두 구하면?', options:['f(±2)=-4','f(0)=12, f(±2)=-4','f(2)=-4만','f(-2)=-4만'], answer:1, explanation:"f'=4x³-16x=4x(x²-4)=0→x=0,±2. f''(0)=-16<0(극대), f''(±2)=32>0(극소). f(0)=12(극대), f(±2)=16-32+12=-4(극소)", difficulty:'hard' },
      { number:18, type:'MULTIPLE_CHOICE', question:'y=x²과 y=2x로 둘러싸인 영역의 넓이는?', options:['1/3','2/3','4/3','8/3'], answer:2, explanation:'교점: x²=2x → x=0,2. ∫₀²(2x-x²)dx=[x²-x³/3]₀²=4-8/3=4/3', difficulty:'hard' },
      { number:19, type:'MULTIPLE_CHOICE', question:'∫₀^π sin²x dx = ?', options:['0','π/4','π/2','π'], answer:2, explanation:'반각 공식: sin²x=(1-cos2x)/2. ∫₀^π (1-cos2x)/2 dx = [x/2-sin2x/4]₀^π = π/2', difficulty:'hard' },
      { number:20, type:'MULTIPLE_CHOICE', question:'방정식 log₃(x-1)+log₃(x+1)=2를 만족하는 x는? (x>1)', options:['√10','2','3','4'], answer:0, explanation:'log₃(x²-1)=2 → x²-1=9 → x²=10 → x=√10 (x>1이므로 양수만)', difficulty:'hard' },
      { number:21, type:'MULTIPLE_CHOICE', question:'함수 f(x)=2x³-9x²+12x-4에서 극대와 극소의 차는?', options:['0','1','4','5'], answer:1, explanation:"f'=6x²-18x+12=6(x-1)(x-2)=0→x=1,2. f(1)=2-9+12-4=1(극대), f(2)=16-36+24-4=0(극소). 차=1-0=1", difficulty:'hard' },
      { number:22, type:'MULTIPLE_CHOICE', question:'Σ(k=1→20) k = 210일 때, Σ(k=1→20) (3k-1)의 값은?', options:['609','610','630','650'], answer:1, explanation:'Σ(3k-1)=3Σk-Σ1=3×210-20=630-20=610', difficulty:'hard' },
      { number:23, type:'MULTIPLE_CHOICE', question:'두 곡선 y=eˣ과 y=e²⁻ˣ의 교점의 x좌표는?', options:['0','1','2','e'], answer:1, explanation:'eˣ=e²⁻ˣ → x=2-x → 2x=2 → x=1', difficulty:'hard' },
      { number:24, type:'MULTIPLE_CHOICE', question:'주머니에 1~5 번호 공이 있다. 2개를 동시에 꺼낼 때, 합이 홀수인 확률은?', options:['2/5','3/5','1/2','7/10'], answer:1, explanation:'전체: ₅C₂=10. 홀+짝 조합: 3(홀)×2(짝)=6가지. 확률=6/10=3/5', difficulty:'hard' },
      { number:25, type:'MULTIPLE_CHOICE', question:'f(x)=xeˣ일 때 f\'(x)는?', options:['eˣ','xeˣ','(x+1)eˣ','(x-1)eˣ'], answer:2, explanation:'곱의 미분: f\'=eˣ+xeˣ=(x+1)eˣ', difficulty:'hard' },
      { number:26, type:'SHORT_ANSWER', question:'lim(x→0) (1-cosx)/x²의 값은?', answer:'1/2', explanation:'로피탈 2회: sinx/2x → cosx/2 → 1/2. 또는 반각: (1-cosx)=2sin²(x/2), 2sin²(x/2)/x²=1/2', difficulty:'hard' },
      { number:27, type:'SHORT_ANSWER', question:'곡선 y=x³-3x 위의 점 (1,-2)에서의 접선의 기울기를 구하세요.', answer:'0', explanation:"y'=3x²-3, x=1 대입: 3(1)-3=0", difficulty:'hard' },
      { number:28, type:'SHORT_ANSWER', question:'∫₀¹ xeˣ dx의 값은? (부분적분 사용)', answer:'1', explanation:'∫xeˣdx = xeˣ-∫eˣdx = xeˣ-eˣ. [xeˣ-eˣ]₀¹ = (e-e)-(0-1) = 0+1 = 1', difficulty:'hard' },
    ],

    // ────────── 코딩 (난이도별 확실히 차등) ──────────
    '코딩': [
      // ── 기본: 문법 확인, 개념 이해 ──
      { number:1, type:'MULTIPLE_CHOICE', question:'Python에서 리스트 컴프리헨션 [x for x in range(10)]의 결과는?', options:['[1,2,...,10]','[0,1,...,9]','[0,1,...,10]','오류'], answer:1, explanation:'range(10)은 0~9를 생성합니다.', difficulty:'easy' },
      { number:2, type:'MULTIPLE_CHOICE', question:'REST API에서 데이터를 생성할 때 사용하는 HTTP 메서드는?', options:['GET','POST','PUT','DELETE'], answer:1, explanation:'POST는 새로운 리소스를 생성할 때 사용합니다.', difficulty:'easy' },
      { number:3, type:'MULTIPLE_CHOICE', question:'Git에서 원격 저장소의 변경사항을 가져와 병합하는 명령은?', options:['git push','git commit','git pull','git add'], answer:2, explanation:'git pull = fetch + merge', difficulty:'easy' },
      { number:4, type:'MULTIPLE_CHOICE', question:'데이터베이스에서 SELECT * FROM users WHERE age > 20은?', options:['모든 사용자 삭제','20세 이상 사용자 조회','사용자 나이 수정','새 사용자 추가'], answer:1, explanation:'SELECT + WHERE 조건으로 데이터를 필터링 조회합니다.', difficulty:'easy' },
      { number:5, type:'SHORT_ANSWER', question:'JavaScript에서 비동기 처리에 사용하는 키워드 2가지를 쓰세요.', answer:'async, await', explanation:'async 함수 안에서 await로 비동기 작업을 기다립니다.', difficulty:'easy' },

      // ── 보통: 알고리즘 분석, 구현 이해 ──
      { number:6, type:'MULTIPLE_CHOICE', question:'해시 테이블에서 충돌(collision)이 발생하는 경우는?', options:['키가 같을 때','값이 같을 때','서로 다른 키가 같은 해시값을 가질 때','테이블이 비어 있을 때'], answer:2, explanation:'서로 다른 키가 같은 해시 인덱스로 매핑될 때 충돌이 발생합니다.', difficulty:'medium' },
      { number:7, type:'MULTIPLE_CHOICE', question:'이진 탐색 트리(BST)에서 노드 검색의 평균 시간 복잡도는?', options:['O(1)','O(log n)','O(n)','O(n²)'], answer:1, explanation:'균형 BST에서 검색은 O(log n)입니다.', difficulty:'medium' },
      { number:8, type:'MULTIPLE_CHOICE', question:'다음 코드의 출력은?\ndef solution(s):\n    stack = []\n    for c in s:\n        if c == "(":\n            stack.append(c)\n        elif c == ")":\n            if not stack: return False\n            stack.pop()\n    return len(stack) == 0\nprint(solution("(())()"))', options:['True','False','오류','None'], answer:0, explanation:'괄호가 올바르게 짝지어져 있으므로 True', difficulty:'medium' },
      { number:9, type:'MULTIPLE_CHOICE', question:'TCP와 UDP의 차이로 올바른 것은?', options:['TCP는 비연결, UDP는 연결 기반','TCP는 신뢰성 보장, UDP는 속도 우선','둘 다 같은 프로토콜','TCP만 인터넷에서 사용'], answer:1, explanation:'TCP는 연결 기반 + 신뢰성, UDP는 비연결 + 속도', difficulty:'medium' },
      { number:10, type:'MULTIPLE_CHOICE', question:'React에서 컴포넌트의 상태를 관리하는 Hook은?', options:['useEffect','useState','useRef','useMemo'], answer:1, explanation:'useState Hook으로 컴포넌트 상태를 관리합니다.', difficulty:'medium' },
      { number:11, type:'SHORT_ANSWER', question:'CSS에서 Flexbox 컨테이너를 만들기 위한 속성과 값은?', answer:'display: flex', explanation:'display: flex로 플렉스 컨테이너를 생성합니다.', difficulty:'medium' },

      // ── 심화: 복합 알고리즘, 시스템 설계 ──
      { number:12, type:'MULTIPLE_CHOICE', question:'다음 DP 코드는 무엇을 구하는가?\ndef solve(n):\n    dp = [0]*(n+1)\n    dp[1] = 1\n    dp[2] = 2\n    for i in range(3, n+1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]', options:['피보나치 수','팩토리얼','계단 오르기 경우의 수','최대공약수'], answer:2, explanation:'1칸 또는 2칸씩 오를 수 있는 계단 오르기의 경우의 수입니다. dp[i]=dp[i-1]+dp[i-2]', difficulty:'hard' },
      { number:13, type:'MULTIPLE_CHOICE', question:'그래프에서 최단 경로를 구하는 다익스트라 알고리즘의 시간 복잡도는? (힙 사용)', options:['O(V)','O(V²)','O(E log V)','O(V!)'], answer:2, explanation:'우선순위 큐(힙) 사용 시 O(E log V)', difficulty:'hard' },
      { number:14, type:'MULTIPLE_CHOICE', question:'다음 코드의 결과는?\ndef knapsack(W, items):\n    n = len(items)\n    dp = [[0]*(W+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        w, v = items[i-1]\n        for j in range(W+1):\n            if w <= j:\n                dp[i][j] = max(dp[i-1][j], dp[i-1][j-w]+v)\n            else:\n                dp[i][j] = dp[i-1][j]\n    return dp[n][W]\nprint(knapsack(5, [(2,3),(3,4),(4,5)]))', options:['5','7','9','12'], answer:1, explanation:'무게2가치3 + 무게3가치4 = 무게5가치7이 최적', difficulty:'hard' },
      { number:15, type:'MULTIPLE_CHOICE', question:'데이터베이스 인덱스가 B-Tree를 사용하는 이유는?', options:['메모리를 적게 사용해서','삽입이 O(1)이라서','디스크 I/O를 최소화하면서 O(log n) 검색이 가능해서','정렬이 필요 없어서'], answer:2, explanation:'B-Tree는 디스크 블록 단위 접근에 최적화되어 I/O를 줄이면서 효율적 검색이 가능합니다.', difficulty:'hard' },
      { number:16, type:'MULTIPLE_CHOICE', question:'동시성(Concurrency) 문제 중 "데드락"의 4가지 조건에 해당하지 않는 것은?', options:['상호 배제','점유 대기','비선점','시간 초과'], answer:3, explanation:'데드락 4조건: 상호배제, 점유대기, 비선점, 순환대기', difficulty:'hard' },
      { number:17, type:'SHORT_ANSWER', question:'빅오 표기법에서 O(n log n)이 O(n²)보다 효율적인 이유를 한 마디로?', answer:'증가율이 더 느리다', explanation:'n이 커질수록 n log n < n²이므로 더 효율적입니다.', difficulty:'hard' },
    ],
  },
}

// ════════════════════════════════════════
//  유틸리티
// ════════════════════════════════════════

/** 학년+과목에 해당하는 문제 풀 반환 (fallback 포함) */
export function getQuestions(grade: string, subject: string, difficulty?: Difficulty | 'all'): Question[] {
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
  if (difficulty && difficulty !== 'all') {
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
