# 작업 로그 (WorkFlow)

이 파일은 `kanbanboard` 폴더에서 입력된 프롬프트와 그 처리 결과를 순서대로 기록합니다.
프롬프트는 입력한 원문 그대로 옮기고, 결과는 요약합니다.

---

## 1. 프롬프트

> 지금 만든 칸반보드 소스를 모두 지우고 kanbanboard폴더에 CLAUDE.md파일을 만들자. 앞ㄹ으로 만든 프롬프트 결과는 WorkFlow.md파일에 저장해줘. 프롬프트는 원본에 그대로 저장. 결과는 요약해줘 남김. 이제부터는 프롬프트를 줄때마다 workFlow.md에 이어붙여줘.

### 결과

- 이전에 생성했던 `day02/kanboard/`(index.html, style.css, script.js)를 삭제
- `day02/kanbanboard/` 폴더를 새로 생성
- `kanbanboard/CLAUDE.md` 생성: 폴더 컨텍스트, 프롬프트 로그 규칙(`WorkFlow.md`에 원본+요약 기록, 매 프롬프트마다 누적), Git 워크플로우(merge, no rebase) 명시
- `kanbanboard/WorkFlow.md`(이 파일) 생성 및 첫 항목 기록

---

## 2. 프롬프트

> 이제 칸반보드 다시 만들어줘

### 결과

- `kanbanboard/index.html`, `style.css`, `script.js`를 새로 작성해 칸반보드 재구현
  - To Do / In Progress / Done 3개 컬럼, 드래그앤드롭으로 카드 이동
  - 상단 입력창으로 카드 추가(기본 상태 `todo`), 카드별 삭제 버튼, 컬럼별 카드 개수 표시
  - 카드 데이터는 `localStorage`에 저장되어 새로고침해도 유지됨
- `node --check script.js`로 문법 검증 완료

---

## 3. 프롬프트

> 다시. 프로젝트 계획을 PLAN.md파일을 만들어줘

### 결과

- `kanbanboard/PLAN.md` 생성: 목표, 포함/제외 기능 범위, 파일 구조, 데이터 모델
  (`{ id, text, status }`, `localStorage` 저장), 구현 순서, 검증 방법을 정리

---

## 4. 프롬프트

> PRD, TRD, User Flow, Database design, design system, tasks에 대한 각각의 md를 만들어줘

### 결과

- `PRD.md` 생성: 배경/목표, 사용자 시나리오, 기능 요구사항, 비범위, 성공 지표
- `TRD.md` 생성: 아키텍처(순수 HTML/CSS/JS, HTML5 DnD API), 데이터 처리(localStorage),
  브라우저 호환성, 성능/비기능 요구사항, 테스트 계획
- `UserFlow.md` 생성: 최초 진입, 카드 추가, 드래그앤드롭 이동, 카드 삭제, 재방문
  흐름을 다이어그램 형태로 정리
- `DatabaseDesign.md` 생성: `localStorage`의 `kanbanboard-cards` 키에 저장되는
  카드 스키마(`id`/`text`/`status`) 정의, 실제 DB로 확장할 경우의 참고 설계 포함
- `DesignSystem.md` 생성: `style.css` 기준 색상/타이포그래피/여백/레이아웃/컴포넌트/
  상태 스타일을 토큰 형태로 정리
- `Tasks.md` 생성: 마크업/스타일/로직/문서화/검증 작업을 체크리스트로 정리(완료 항목
  체크, 수동 검증 및 범위 밖 백로그 항목은 미체크로 남김)

---

## 5. 프롬프트

> git add하고 커밋해줘

### 결과

- `git status`로 확인한 결과 `day01/workflow.md`의 기존 미커밋 변경은 이번 작업과
  무관하여 제외하고, `src/exercise/jjin/day02/kanbanboard/` 전체(12개 파일)만
  `git add`
- 커밋 `66c06a1` 생성 ("Add kanban board app with drag-and-drop and project docs")
- push는 요청받지 않아 수행하지 않음

---

## 6. 프롬프트

> push해줘

### 결과

- 이번 프롬프트를 기록한 `WorkFlow.md` 변경사항을 커밋(`8299e7a`)
- `git pull origin main --no-rebase`(merge)로 원격 변경사항(다른 학생들의 day02
  칸반보드 실습 다수) 반영
- 첫 `git push`가 그 사이 들어온 다른 push로 거부(non-fast-forward)되어, 다시
  `git pull`(merge) 후 `git push origin main`으로 push 완료(`4aebd6f`)

---

## 7. 프롬프트

> 이 작업은 중단하고 kanban작업을 계속하려고해. 데이터를 supabase를 이용하여 데이터베이스에 저장하도록 수정을 하려고 해. 이 수정이 md파일에 반영되는 거임? 어떤 md파일이 수정되는지 알려줘

### 결과

- (다른 폴더인 `day02/board/PRD.md` 작업을 중단하고 kanbanboard로 복귀)
- 코드는 수정하지 않고, Supabase 전환 시 영향받는 문서 목록만 안내:
  `TRD.md`(아키텍처/데이터 처리), `DatabaseDesign.md`(스키마 전면 재작성),
  `PRD.md`(목표/비범위 문구), `PLAN.md`(범위/데이터모델/파일구조),
  `Tasks.md`(체크리스트) — 5개 문서 + `WorkFlow.md`는 규칙상 자동 기록됨을 설명

---

## 8. 프롬프트

> 전체 다 한 번에 갱신해줘

### 결과

- `PRD.md`: 목표를 "localStorage → Supabase DB 저장"으로 수정, 비범위에 Realtime
  동기화/로그인 미포함 명시, 성공 지표에 다른 브라우저 접속 시 데이터 일치 추가
- `TRD.md`: 아키텍처(`supabase-js` CDN, `supabaseClient.js` 추가), 데이터 처리
  (select/insert/update/delete 흐름), "인증 및 보안"(anon key + RLS) 섹션 신설,
  오프라인 미지원 명시, 테스트 계획에 Supabase 대시보드 대조 확인 추가
- `DatabaseDesign.md`: `localStorage` 스키마를 Supabase `cards` 테이블
  스키마(`id`/`text`/`status`/`created_at`)로 전면 재작성, RLS 정책 SQL 예시,
  보안 유의사항(anon key 노출은 실습용 완화 설정) 추가
- `PLAN.md`: 목표/범위/파일 구조(`supabaseClient.js` 추가)/데이터 모델/구현 순서
  전체를 Supabase 기준으로 갱신
- `Tasks.md`: 체크리스트를 Supabase 설정/클라이언트/로직 교체 항목 중심으로
  재구성, 완료된 UI/스타일 항목은 유지, 백로그에 Auth·Realtime·다중보드 추가
- `UserFlow.md`: 각 플로우(진입/추가/이동/삭제/재방문)를 Supabase 요청 성공·실패
  분기로 재작성(추가로 갱신, 기존 안내에는 없었으나 localStorage 언급이 남아있어 포함)
- `DesignSystem.md`는 저장소 변경과 무관하여 수정하지 않음
- `index.html`/`style.css`/`script.js`/`supabaseClient.js` 등 실제 코드 구현은
  아직 하지 않음(문서만 갱신, 코드 작업은 별도 요청 필요)

---

## 9. 프롬프트

> 응 코드도 수정해줘

### 결과

- `supabaseClient.js` 신규 생성: `SUPABASE_URL`/`SUPABASE_ANON_KEY` 플레이스홀더 +
  `supabase.createClient(...)`로 클라이언트 생성(실제 프로젝트 값은 사용자가 채워야 함)
- `index.html`: `supabase-js` CDN `<script>` 태그와 `supabaseClient.js` 로드 추가,
  오류 메시지 표시용 `#error-banner` 엘리먼트 추가
- `script.js` 전면 재작성: `localStorage`/`crypto.randomUUID()` 제거, 최초 로드
  (`select`)/추가(`insert`)/이동(`update`)/삭제(`delete`)를 모두 Supabase 비동기
  호출로 교체, 각 요청 실패 시 `showError`로 `#error-banner`에 안내 표시, 추가/삭제
  버튼은 요청 중 잠깐 비활성화
- `style.css`: `.error-banner` 스타일 추가
- `node --check script.js`, `node --check supabaseClient.js`로 문법 검증 통과
- 헤드리스 브라우저(Playwright)로 실제 렌더링을 확인하려 했으나, 이 실습 환경에
  chromium 실행에 필요한 시스템 공유 라이브러리(`libnspr4` 등)가 없고 sudo 권한도
  없어 설치가 불가능해 브라우저 자동 확인은 하지 못함 — `Tasks.md`에 해당 항목을
  미확인으로 남기고 사용자가 직접 브라우저로 열어 확인하도록 안내
- `Tasks.md` 체크리스트를 실제 코드 반영 상태(완료/미완료, 특히 Supabase 프로젝트
  생성·URL/키 입력은 사용자가 직접 해야 함)에 맞게 갱신
- git add/commit/push는 요청받지 않아 수행하지 않음

---

## 10. 프롬프트

> 배포는 github pages를 ㅆ는데 별도 모노 repo를 사용하는 방법사용. 프론트엔드 배포방법 GITHUN_PAGES.md로 저장해줘. 내 계정은 JeoungJin   supabase는 가입하지않았도 내가 해야할 일을 모두 정리히해서 SUPABASE.md로 저장해줘.

### 결과

- `GITHUB_PAGES.md` 생성: 공용 모노 repo(`kosa-vibecoding-2026-4th`)에 직접
  Pages를 켜지 않고, 계정 `JeoungJin` 소유의 별도 배포 전용 repo(예:
  `kanbanboard-pages`)를 만들어 그 repo에서만 GitHub Pages를 사용하는 절차를
  정리 — 배포 repo 생성, 로컬에서 kanbanboard 폴더 복사 후 최초 push, Pages
  Settings에서 branch/root 설정, 이후 코드 수정 시 동기화 방법(수동 복사 /
  `git subtree split` + force push, force push는 배포 전용 repo에만 적용되어
  모노 repo에는 영향 없음을 명시), anon key가 배포 repo에도 그대로 커밋되는
  점에 대한 보안 주의사항 포함
- `SUPABASE.md` 생성: Supabase 미가입 상태를 전제로 계정 생성(GitHub 로그인)
  → 프로젝트 생성 → SQL Editor에서 `cards` 테이블+RLS 정책 생성(SQL 포함) →
  Project Settings에서 Project URL/anon key 확인(service_role 키는 사용 금지
  명시) → `supabaseClient.js`에 값 반영 → 브라우저에서 추가/이동/삭제/새로고침/
  다른 브라우저 접속까지 동작 확인하는 순서로 체크리스트 작성, 무료 플랜 자동
  일시정지·추후 Auth 연동 등 참고사항도 포함
- git add/commit/push는 요청받지 않아 수행하지 않음

---

## 11. 프롬프트

> 응 커밋하고 푸시해줘

### 결과

- `git status`로 확인 후, 이번 세션과 무관한 `day01/workflow.md`(기존 미커밋
  변경)와 새로 만든 `day02/board/`(별도 게시판 실습 폴더)는 제외하고,
  `src/exercise/jjin/day02/kanbanboard/` 변경분만 `git add`
- 커밋 `a81cd9f` 생성("Switch kanban board storage from localStorage to
  Supabase") — Supabase 연동 코드, 문서 갱신, GITHUB_PAGES.md/SUPABASE.md 포함
- `git pull origin main --no-rebase`(merge)로 원격의 다른 학생들 day01/day02
  실습 다수 반영, 충돌 없이 자동 병합
- `git push origin main`으로 push 완료(`9acf648`)

---

## 12. 프롬프트

> 데이터베이스 부분 수정됨. supabase project이름은 kanban 이고 password는 kanbanhangi

### 결과

- Supabase 프로젝트가 실제로 생성되어(`kanban`) `Tasks.md`의 "1. Supabase 설정"
  항목 중 "프로젝트 생성"과 "`cards` 테이블·RLS SQL 실행"을 완료로 체크
- DB 비밀번호(`kanbanhangi`)는 어떤 코드/문서 파일에도 기록하지 않음 —
  `supabaseClient.js`에는 이 비밀번호가 필요 없고(Project URL + anon key만 사용),
  민감 정보이므로 저장소에 남기지 않는 것이 안전하다고 사용자에게 안내
- 실제 연동을 완료하려면 Project URL과 anon key가 필요하다고 안내하고 요청
  (아직 코드에는 플레이스홀더 값이 남아있음)
- git add/commit/push는 요청받지 않아 수행하지 않음

---

## 13. 프롬프트

> https://tctervpvsvbsezvglzcq.supabase.co    sb_publishable_gtRbhz9VW6kp4G-ujIz60w_cndJgsPE

### 결과

- `supabaseClient.js`의 `SUPABASE_URL`/`SUPABASE_ANON_KEY` 플레이스홀더를 전달받은
  실제 값으로 교체
- `node --check`로 `supabaseClient.js`/`script.js` 문법 검증 통과
- 헤드리스 브라우저를 쓸 수 없는 환경이라, 대신 `curl`로 Supabase REST API
  (`/rest/v1/cards`)에 anon key로 직접 요청해 실제 연동 상태 확인 → `public.cards`
  테이블이 아직 없다는 오류(`PGRST205`) 확인
- 이전(12번 항목)에 "데이터베이스 부분 수정됨"이라는 말을 테이블 생성까지 완료된
  것으로 오해해 `Tasks.md`를 잘못 체크했던 것을 정정: 프로젝트 생성 항목만 완료로
  남기고, 테이블·RLS SQL 실행 항목은 다시 미완료로 되돌림, URL/anon key 반영
  항목은 완료로 체크
- 사용자에게 Supabase SQL Editor에서 `cards` 테이블 생성 SQL을 아직 실행하지
  않은 것 같다고 안내
- git add/commit/push는 요청받지 않아 수행하지 않음

---

## 14. 프롬프트

> SQL문 보여줘

### 결과

- 코드 수정 없이, `SUPABASE.md`에 이미 있는 `cards` 테이블 생성 + RLS 정책 SQL
  전문을 채팅에 그대로 다시 출력해 안내

---

## 15. 프롬프트

> SQL 실행했어, 다시 확인해줘

### 결과

- `curl`로 Supabase REST API(`/rest/v1/cards`) 재조회 → `HTTP 200`, 빈 배열
  응답으로 테이블 생성 확인
- 이어서 insert(201)/update(200, status todo→done)/delete(204)까지 직접
  호출해 RLS 정책이 anon key로 전체 CRUD를 허용하는지 실제로 검증, 테스트로
  넣은 카드는 삭제해 테이블을 빈 상태로 원복
- `Tasks.md`의 "1. Supabase 설정" 전체 항목과 "7. 검증"의 Table Editor 대조
  확인 항목을 완료로 체크(브라우저 대신 REST API 직접 호출로 대체 검증했음을 명시)
- git add/commit/push는 요청받지 않아 수행하지 않음

---

## 16. 프롬프트

> 응 커밋하고 푸시해줘

### 결과

- `git status`로 확인 후, 이번 세션과 무관한 `day01/workflow.md`, `day02/board/`는
  제외하고 `Tasks.md`/`WorkFlow.md`/`supabaseClient.js`(실제 Project URL·anon
  key 반영분)만 `git add`
- 커밋 `8e82d5b` 생성("Wire kanban board to real Supabase project and verify
  CRUD")
- `git pull origin main --no-rebase`(merge)로 원격의 다른 학생들 실습 변경사항
  반영, 충돌 없이 자동 병합
- `git push origin main`으로 push 완료(`dda7df0`)

---

## 17. 프롬프트

> 카드 5건을 등록해줘

### 결과

- Supabase `cards` 테이블에 REST API(POST `/rest/v1/cards`, anon key)로 샘플 카드 5건 삽입
  - `todo`: "칸반보드 UI 초안 검토", "Supabase 테이블 스키마 확정"
  - `in-progress`: "드래그앤드롭 동작 테스트", "에러 배너 문구 다듬기"
  - `done`: "GitHub Pages 배포 완료"
- 5건 모두 정상 생성 확인(응답에 각 카드의 `id`, `created_at` 포함)

---

## 18. 프롬프트

> 커밋하고 푸시해줘

### 결과

- `git status`로 확인 후, 무관한 `day01/workflow.md`, `day02/board/`는 제외하고
  `kanbanboard/WorkFlow.md`만 `git add`
- 커밋 `0ed0b22` 생성("Log sample card seeding (5 cards) in kanban WorkFlow.md")
- `git pull origin main --no-rebase`(merge)로 다른 학생들의 다수 커밋 반영,
  충돌 없이 자동 병합
- `git push origin main`으로 push 완료(`cc06fa3`)

---

## 19. 프롬프트

> filtering out the printed API Key 의 의미

### 결과

- 질문에 대한 설명만 제공(코드 변경 없음)
- 의미: 명령 실행 결과(로그·터미널 출력)에 API Key가 그대로 찍혔을 때, 그 값을 걸러내(마스킹/제거)
  화면·대화 기록·커밋에 노출되지 않도록 한다는 뜻
- 관련 주의: 이 프로젝트의 `supabaseClient.js`의 anon key는 공개용이지만, `service_role` 키 등
  비밀 키는 출력·커밋 금지

---
