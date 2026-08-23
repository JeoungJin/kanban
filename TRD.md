# TRD - 칸반보드

## 1. 아키텍처

- 스택: HTML + CSS + Vanilla JavaScript, 여기에 Supabase 공식 클라이언트
  라이브러리(`@supabase/supabase-js`)를 CDN(`<script>` 태그)으로 추가. 빌드
  도구·프레임워크·npm 설치 과정 없음
- 파일 구성: `index.html`(마크업, supabase-js CDN 스크립트 포함),
  `style.css`(스타일), `supabaseClient.js`(Supabase 프로젝트 URL·anon key로
  클라이언트 생성), `script.js`(상태 관리·이벤트 로직, Supabase CRUD 호출)
- 실행 방식: 여전히 정적 파일이므로 `index.html`을 브라우저에서 직접 열거나
  간단한 정적 서버(`python3 -m http.server`)로 서빙 가능. 다만 데이터 저장을
  위해 Supabase 프로젝트(호스팅된 BaaS)에 대한 **네트워크 연결이 필수**이며,
  직접 구현하는 커스텀 백엔드 서버는 여전히 없음
- 카드 이동 구현: 브라우저 기본 HTML5 Drag and Drop API(`draggable`,
  `dragstart`, `dragend`, `dragover`, `drop` 이벤트) 사용, 별도 드래그앤드롭
  라이브러리 없음

## 2. 데이터 처리

- 저장소: Supabase 프로젝트의 Postgres DB, `cards` 테이블 — 스키마는
  [DatabaseDesign.md](./DatabaseDesign.md) 참고
- 클라이언트 초기화: `supabaseClient.js`에서
  `supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)`로 클라이언트 생성,
  `script.js`에서 이 클라이언트를 통해 `cards` 테이블에 접근
- 데이터 흐름(요청-응답 기반, 낙관적 업데이트 없음):
  - 최초 로드: `supabaseClient.from('cards').select('*').order('created_at')`로
    전체 카드를 조회 → 메모리상의 `cards` 배열에 반영 → 렌더링
  - 카드 추가: `supabaseClient.from('cards').insert({ text, status: 'todo' })`
    호출 → 성공 시 반환된 행(또는 재조회 결과)으로 `cards` 배열 갱신 → 렌더링
  - 카드 이동(드래그앤드롭): `supabaseClient.from('cards').update({ status })
    .eq('id', cardId)` 호출 → 성공 시 로컬 `cards` 배열의 해당 카드 status
    갱신 → 렌더링
  - 카드 삭제: `supabaseClient.from('cards').delete().eq('id', cardId)` 호출
    → 성공 시 로컬 `cards` 배열에서 제거 → 렌더링
  - 각 호출은 `await`로 처리하고, 실패 시(네트워크 오류, RLS 정책 거부 등)
    로컬 상태를 낙관적으로 먼저 바꾸지 않고 실패를 사용자에게 알림(alert 또는
    화면 상단 오류 메시지)
- 데이터 범위: 카드 데이터는 Supabase 프로젝트(클라우드) 단위로 저장되며, 같은
  프로젝트 URL/anon key를 아는 클라이언트라면 브라우저·기기에 관계없이 동일한
  데이터를 조회/수정할 수 있음(단일 공유 DB)
- ID 생성: 더 이상 클라이언트에서 `crypto.randomUUID()`로 생성하지 않고, DB
  컬럼 기본값(`gen_random_uuid()`)으로 서버(Supabase) 측에서 발급

## 3. 인증 및 보안

- 인증 없이 Supabase anon(공개) key를 프론트엔드 코드에 그대로 사용 — 이 key는
  브라우저에 노출되는 것을 전제로 설계된 공개 키이지만, 접근 제어는 반드시
  Supabase Row Level Security(RLS) 정책으로 해야 함
- 실습 범위에서는 `cards` 테이블에 RLS를 활성화하고 anon 역할에 대해
  select/insert/update/delete를 모두 허용하는 정책을 둔다(자세한 내용은
  [DatabaseDesign.md](./DatabaseDesign.md) 참고) — 이는 실습용 완화된 설정이며,
  실제 서비스에서는 사용자별 접근 제한이 필요함을 문서에 명시
- Supabase 프로젝트 URL과 anon key는 커밋 가능한 공개 정보로 취급하되(RLS로
  보호), `service_role` key는 절대 프론트엔드 코드에 포함하지 않음

## 4. 브라우저 호환성 요구사항

- HTML5 Drag and Drop API, `fetch`(supabase-js 내부 사용), ES 모듈 문법을
  지원하는 최신 데스크톱 브라우저(Chrome, Edge, Firefox, Safari 최신 버전)
  기준으로 개발
- 터치 전용 모바일 기기의 네이티브 드래그앤드롭(터치 이벤트 기반) 지원은 범위
  밖 — 모바일에서는 조회 위주로 사용하는 것을 전제로 함

## 5. 성능/비기능 요구사항

- 카드 수가 많지 않은(수십~수백 개) 개인 사용을 전제로 하며, 별도의 가상
  스크롤이나 페이지네이션은 두지 않음
- Supabase 호출마다 네트워크 왕복이 발생하므로, 카드 추가/이동/삭제 시 버튼을
  잠깐 비활성화하거나 로딩 표시를 두어 중복 요청을 방지
- 네트워크 연결이 없거나 Supabase 프로젝트에 접근할 수 없으면 카드 목록을 볼 수
  없음(기존 localStorage 버전과 달리 완전한 오프라인 동작은 더 이상 지원하지
  않음) — 이 제약을 화면에 명시적으로 안내

## 6. 테스트 계획

- 정적 검증: `node --check script.js`, `node --check supabaseClient.js`로
  문법 오류 확인
- Supabase 연동 확인: Supabase 대시보드의 Table Editor에서 `cards` 테이블에
  브라우저 조작(추가/이동/삭제)이 실시간으로 반영되는지 직접 대조 확인
- 수동 브라우저 테스트: 카드 추가 → 컬럼 간 드래그 이동 → 카드 삭제 →
  새로고침 후 상태 유지 → **다른 브라우저(또는 시크릿 창)로 접속했을 때 동일한
  데이터가 보이는지**까지 데스크톱(3열)·모바일 폭(1열) 두 레이아웃에서 각각 확인
- 오류 처리 확인: Supabase URL/anon key를 의도적으로 잘못된 값으로 바꿔
  네트워크 실패 시 사용자에게 오류가 안내되는지 확인
- 회귀 확인: `style.css`/`script.js`/`supabaseClient.js` 수정 시 위 수동 테스트
  시나리오를 다시 수행
