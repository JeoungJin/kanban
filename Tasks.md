# Tasks - 칸반보드

`PLAN.md`의 구현 순서를 작업 단위로 쪼갠 체크리스트. Supabase 전환 이전에
완료된 항목은 체크 표시했고, 전환 관련 신규 항목은 미체크로 남겼다.

## 1. Supabase 설정

- [x] Supabase 프로젝트 생성 (프로젝트 이름 `kanban`)
- [x] `cards` 테이블 생성 및 RLS 정책 SQL 실행 완료 — REST API로 select(200,
      빈 배열)/insert(201)/update(200)/delete(204) 모두 정상 동작 확인
- [x] 발급받은 프로젝트 URL·anon key(`sb_publishable_...` 형식)를
      `supabaseClient.js`의 `SUPABASE_URL`/`SUPABASE_ANON_KEY`에 반영 완료

## 2. 마크업 (index.html)

- [x] 헤더에 제목과 카드 추가 폼(입력창 + 버튼) 작성
- [x] `To Do` / `In Progress` / `Done` 3개 컬럼 섹션 작성, 각 컬럼에 카드 개수 표시 영역 추가
- [x] 각 컬럼의 카드 리스트 컨테이너에 `ondragover`/`ondrop` 핸들러 연결
- [x] `supabase-js` CDN `<script>` 태그 추가, `supabaseClient.js`/`script.js` 로드 순서 정리
      (`error-banner` 표시용 엘리먼트 추가)

## 3. 스타일 (style.css)

- [x] 3컬럼 그리드 레이아웃 및 카드/컬럼 기본 스타일 작성
- [x] 드래그 중(`.dragging`) / 드롭 대상 강조(`.drag-over`) 상태 스타일 작성
- [x] 720px 이하 화면에서 1열로 전환되는 반응형 스타일 작성
- [x] Supabase 요청 실패 시 노출할 오류 메시지(`.error-banner`) 스타일 추가

## 4. Supabase 클라이언트 (supabaseClient.js)

- [x] `createClient(SUPABASE_URL, SUPABASE_ANON_KEY)`로 클라이언트 생성
      (URL/key는 아직 플레이스홀더 — 실제 프로젝트 값 입력 필요, 1번 항목 참고)

## 5. 로직 (script.js)

- [x] `localStorage` 기반 `loadCards`/`saveCards`를 Supabase 호출로 교체
  - [x] 최초 로드: `cards` 테이블 `select` 후 `created_at` 순 정렬하여 렌더링(`loadCards`)
  - [x] 카드 추가: `insert({ text, status: 'todo' }).select().single()` 후 응답 반영
  - [x] 카드 이동: `update({ status }).eq('id', cardId)` 후 로컬 상태 갱신
  - [x] 카드 삭제: `delete().eq('id', cardId)` 후 로컬 상태에서 제거(`deleteCard`)
- [x] 컬럼별 카드 렌더링 및 카드 개수 갱신(`render`)
- [x] 카드 DOM 생성 및 `dragstart`/`dragend` 이벤트 연결(`createCardElement`)
- [x] 컬럼의 `dragover`/`drop` 이벤트로 카드 `status` 변경 및 재렌더링(Supabase 연동 완료)
- [x] 카드 추가 폼 제출 처리(`todo` 상태로 새 카드 생성, Supabase 연동 완료)
- [x] 카드별 삭제 버튼 처리(Supabase 연동 완료)
- [x] Supabase 요청 실패 시 사용자에게 오류 안내(`showError`/`error-banner`) 처리 추가
- [x] 클라이언트 측 `crypto.randomUUID()` ID 생성 로직 제거(DB가 `id` 발급)

## 6. 문서화

- [x] `PLAN.md` 작성(목표/범위/파일구조/데이터모델/구현순서/검증방법) — Supabase 반영 갱신 완료
- [x] `PRD.md` 작성 — Supabase 반영 갱신 완료
- [x] `TRD.md` 작성 — Supabase 반영 갱신 완료
- [x] `UserFlow.md` 작성 — Supabase 흐름(성공/실패 분기 포함)으로 갱신 완료
- [x] `DatabaseDesign.md` 작성 — Supabase `cards` 테이블 스키마로 갱신 완료
- [x] `DesignSystem.md` 작성 — ※ 저장소 변경과 무관, 갱신 불필요
- [x] `Tasks.md` 작성(이 문서, Supabase 항목 반영)

## 7. 검증

- [x] `node --check script.js`로 문법 검증(Supabase 연동 버전 기준 재검증 완료)
- [x] `node --check supabaseClient.js`로 문법 검증
- [x] Supabase 대시보드 Table Editor에서 브라우저 조작이 실제 테이블에 반영되는지 대조 확인
      — 브라우저 대신 REST API(`curl`)로 select/insert/update/delete를 직접
      호출해 `cards` 테이블에 정상 반영·삭제되는 것까지 확인 완료
- [ ] 브라우저에서 카드 추가 → 드래그 이동 → 삭제 → 새로고침 후 상태 유지 수동 확인
      (실제 Supabase 프로젝트 URL/key 입력 후 가능)
- [ ] 다른 브라우저(시크릿 창)로 접속해도 동일한 카드 데이터가 보이는지 확인
- [ ] Supabase URL/anon key가 플레이스홀더인 상태(현재 상태)에서 요청 실패 시
      `error-banner`에 오류 안내가 표시되는지 브라우저에서 직접 확인
      (코드 상으로는 `loadCards` 실패 시 `showError` 호출로 반영되나, 이 실습 환경
      에서는 헤드리스 브라우저 실행에 필요한 시스템 라이브러리·sudo 권한이 없어
      자동화된 브라우저 확인을 하지 못함 — 사용자가 직접 `index.html`을 열어 확인 필요)
- [ ] 모바일 폭(≤720px)에서 1열 레이아웃 및 드래그앤드롭 동작 확인

## 8. 백로그 (범위 밖, 착수 안 함)

- [ ] 같은 컬럼 내 카드 순서 변경(정렬, `position` 컬럼 필요)
- [ ] 카드 내용 인라인 수정
- [ ] 마감일/담당자/라벨 등 카드 부가 정보
- [ ] Supabase Auth 연동, 사용자별 보드 소유권 관리
- [ ] Supabase Realtime을 이용한 다중 클라이언트 실시간 동기화
- [ ] 다중 보드 관리
