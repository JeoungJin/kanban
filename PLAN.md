# 칸반보드 프로젝트 계획

## 목표

To Do / In Progress / Done 3단 컬럼으로 구성되고, 카드를 드래그앤드롭으로 컬럼 간
이동할 수 있는 칸반보드를 HTML + CSS + Vanilla JavaScript로 구현하되, 카드 데이터는
브라우저 `localStorage` 대신 Supabase(BaaS)의 Postgres DB에 저장한다. 빌드 도구·
프레임워크는 여전히 사용하지 않으며, `supabase-js`만 CDN으로 추가한다.

## 범위 (포함 기능)

- 3개 컬럼: `To Do`, `In Progress`, `Done`
- HTML5 Drag and Drop API(`dragstart`/`dragend`/`dragover`/`drop`)를 이용한 카드 이동
- 상단 입력 폼으로 새 카드 추가(기본 상태는 `To Do`)
- 카드별 삭제 버튼
- 컬럼별 카드 개수 표시
- Supabase `cards` 테이블을 이용한 카드 상태 저장 — 새로고침·재접속·다른
  브라우저에서도 동일하게 유지(자세한 스키마는 [DatabaseDesign.md](./DatabaseDesign.md))
- 좁은 화면(≤720px)에서 1열로 쌓이는 반응형 레이아웃
- Supabase 요청 실패 시(네트워크 오류 등) 사용자에게 오류 안내

## 범위 밖 (제외 기능)

- 카드 내용 수정(인라인 편집), 카드 상세/설명, 마감일, 담당자, 라벨/태그
- 같은 컬럼 내 카드 순서 변경(정렬)
- 다중 보드, 로그인/회원가입/사용자별 권한 관리(Supabase Auth 미사용)
- Supabase Realtime을 이용한 여러 클라이언트 간 실시간 동기화
- 실행 취소(undo), 검색/필터

## 파일 구조

```
kanbanboard/
├── CLAUDE.md          — 폴더 작업 규칙(프롬프트 로그, Git 워크플로우)
├── PLAN.md            — 이 문서
├── WorkFlow.md        — 프롬프트 원본 + 결과 요약 기록
├── index.html         — 마크업(헤더의 카드 추가 폼, 3개 컬럼 섹션, supabase-js CDN 스크립트)
├── style.css          — 3컬럼 그리드 레이아웃, 카드/드래그 상태 스타일
├── supabaseClient.js  — Supabase 프로젝트 URL·anon key로 클라이언트 생성
└── script.js          — 카드 데이터 관리, 렌더링, 드래그앤드롭·추가·삭제 로직(Supabase CRUD 호출)
```

## 데이터 모델

카드는 `{ id, text, status, created_at }` 형태이며, `status`는 `todo` /
`in-progress` / `done` 중 하나이다. Supabase `cards` 테이블에 행 단위로
저장되고(전체 스냅샷 저장이 아님), `id`는 DB가 `gen_random_uuid()`로 발급한다.
자세한 컬럼 정의와 RLS 정책은 [DatabaseDesign.md](./DatabaseDesign.md) 참고.

## 구현 순서

1. Supabase 프로젝트 생성, `cards` 테이블 및 RLS 정책 SQL 실행
   (DatabaseDesign.md 참고), 프로젝트 URL·anon key 확보
2. `index.html`에 `supabase-js` CDN `<script>` 태그 추가, 헤더(제목 + 추가 폼)와
   3개 컬럼 섹션 마크업 작성, 각 컬럼에 `ondragover`/`ondrop` 핸들러 연결
3. `style.css`로 그리드 레이아웃과 카드/컬럼 스타일, 드래그 중(`.dragging`)·드롭
   대상 위(`.drag-over`) 상태 스타일 작성
4. `supabaseClient.js`에서 `createClient(SUPABASE_URL, SUPABASE_ANON_KEY)`로
   클라이언트 생성 후 export
5. `script.js`에서 최초 로드시 `cards` 테이블 select로 카드 목록을 불러와
   렌더링하는 함수 작성
6. 드래그앤드롭 이벤트로 `update`(status 변경) 호출 후 재렌더링
7. 카드 추가 폼(`insert`)과 삭제 버튼(`delete`) 이벤트 연결
8. Supabase 요청 실패 시 사용자에게 오류를 안내하는 처리 추가
9. `node --check script.js`로 문법 검증, 브라우저에서 추가·드래그·삭제·새로고침
   유지·다른 브라우저에서 동일 데이터 확인까지 수동 테스트

## 검증 방법

- `node --check script.js`, `node --check supabaseClient.js`로 정적 문법 오류 확인
- Supabase 대시보드 Table Editor에서 브라우저 조작이 실제 테이블에 반영되는지 대조
- 브라우저에서 `index.html`을 열어: 카드 추가 → 각 컬럼 간 드래그 이동 →
  카드 삭제 → 새로고침 후 상태 유지 → 다른 브라우저(시크릿 창)에서 동일 데이터
  확인까지 직접 확인
