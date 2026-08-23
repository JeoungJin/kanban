# Database Design - 칸반보드

이 프로젝트는 커스텀 백엔드 서버 없이 Supabase를 BaaS(Backend as a Service)로
사용한다. 실제 데이터 저장은 Supabase가 제공하는 Postgres DB의 `cards`
테이블에서 이루어지며, 프론트엔드(`script.js`)는 `supabase-js` 클라이언트로
이 테이블에 직접 CRUD 요청을 보낸다. (이전 버전은 브라우저 `localStorage`를
사용했으나, 기기 간 데이터 공유가 불가능하고 저장소 삭제 시 데이터가 유실되는
한계로 인해 Supabase DB로 교체함)

## 1. 저장소 개요

- 저장 위치: Supabase 프로젝트의 Postgres DB (테이블: `cards`)
- 접근 방식: 프론트엔드에서 `supabase-js` 클라이언트 + anon(공개) key로 직접
  테이블에 select/insert/update/delete 요청
- 접근 제어: Row Level Security(RLS) 정책으로 anon 역할의 CRUD를 허용(아래
  3번 참고) — 커스텀 API 서버를 별도로 두지 않음
- 저장 시점: 카드 추가/이동/삭제 각각의 사용자 조작이 즉시 해당 CRUD 요청으로
  이어짐(이전처럼 전체 배열을 매번 덮어쓰는 스냅샷 저장 방식이 아니라, 변경된
  행 단위로 반영)

## 2. `cards` 테이블 스키마

| 컬럼        | 타입          | 제약/기본값                                      | 설명                                   |
|-------------|---------------|---------------------------------------------------|----------------------------------------|
| id          | uuid          | `default gen_random_uuid()`, primary key           | 카드 고유 식별자(DB가 발급)             |
| text        | text          | `not null`                                          | 카드에 표시되는 할 일 텍스트            |
| status      | text          | `not null`, `check (status in ('todo','in-progress','done'))` | 카드가 속한 컬럼           |
| created_at  | timestamptz   | `default now()`, `not null`                         | 생성 시각(카드 정렬 기준으로도 사용)    |

### 테이블 생성 예시 (Supabase SQL Editor)

```sql
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  status text not null check (status in ('todo', 'in-progress', 'done')),
  created_at timestamptz not null default now()
);

alter table public.cards enable row level security;

create policy "anon can read cards"
  on public.cards for select
  to anon
  using (true);

create policy "anon can insert cards"
  on public.cards for insert
  to anon
  with check (true);

create policy "anon can update cards"
  on public.cards for update
  to anon
  using (true)
  with check (true);

create policy "anon can delete cards"
  on public.cards for delete
  to anon
  using (true);
```

### 예시 데이터

```json
[
  { "id": "3f2a1c...", "text": "칸반보드 기획하기", "status": "todo", "created_at": "2026-08-23T01:10:00Z" },
  { "id": "9b7e44...", "text": "HTML/CSS 레이아웃 작업", "status": "in-progress", "created_at": "2026-08-23T01:12:00Z" },
  { "id": "1d0f6a...", "text": "프로젝트 폴더 생성", "status": "done", "created_at": "2026-08-23T01:05:00Z" }
]
```

## 3. 보안 및 접근 제어 (RLS)

- anon key는 브라우저에 노출되는 것을 전제로 한 공개 키이므로, 접근 제어는 반드시
  RLS 정책으로 처리한다. `service_role` key는 절대 프론트엔드 코드에 포함하지 않음
- 실습 범위에서는 위 SQL처럼 anon 역할에 대해 select/insert/update/delete를 모두
  허용하는 완화된 정책을 사용한다 — 즉, 이 anon key와 프로젝트 URL을 아는 누구나
  `cards` 테이블을 읽고 쓸 수 있다는 뜻이며, **학습용 실습 범위에서만 허용**되는
  설정이다. 실제 서비스로 확장할 경우 사용자 인증(Supabase Auth)과 사용자별
  접근을 제한하는 RLS 정책(`auth.uid() = owner_id` 등)으로 반드시 강화해야 함

## 4. 제약 및 규칙

- `id`는 DB가 카드 생성 시 한 번만 발급하며 변경되지 않음(삭제 전까지 고정 식별자)
- `status`는 CHECK 제약으로 위 3개 값만 허용되며, 컬럼 DOM 요소의 `id` 속성
  (`todo`, `in-progress`, `done`)과 1:1로 대응된다
- 카드 순서(같은 컬럼 내 정렬 순서)는 별도 컬럼으로 저장하지 않으며, `created_at`
  오름차순을 렌더링 순서로 사용
- Supabase 요청이 실패하면(네트워크 오류, RLS 거부 등) 로컬 `cards` 배열을
  낙관적으로 먼저 바꾸지 않고, 사용자에게 오류를 알리고 이전 상태를 유지

## 5. 향후 확장 고려 사항 (참고용, 현재 범위 밖)

여러 사용자·다중 보드 지원이 필요해지면 다음과 같은 형태로 확장할 수 있다
(현재 프로젝트에서는 구현하지 않음):

- `boards` 테이블: 다중 보드 지원 시 보드 단위로 카드를 그룹화(`cards.board_id` FK 추가)
- Supabase Auth 연동: 사용자별 보드 소유권 관리, RLS 정책을 `auth.uid()` 기준으로 강화
- `position`(정렬용 컬럼) 추가: 같은 컬럼 내 카드 순서를 사용자가 직접 조정할 경우
- Supabase Realtime 구독: 여러 클라이언트 간 변경 사항을 폴링/새로고침 없이
  실시간으로 반영
