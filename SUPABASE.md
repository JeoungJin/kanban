# Supabase 설정 체크리스트 - 칸반보드

아직 Supabase 계정/프로젝트가 없는 상태를 전제로, 처음부터 끝까지 직접
해야 할 일을 순서대로 정리한 문서. 코드(`script.js`, `supabaseClient.js`)는
이미 Supabase 연동을 전제로 작성되어 있으므로, 아래 순서를 마치면 바로
동작한다.

## 1. 계정 생성 및 프로젝트 생성

1. https://supabase.com 접속
2. "Start your project" 클릭 → GitHub 계정(`JeoungJin`)으로 로그인
   (Sign in with GitHub) — 이메일로 별도 가입도 가능하지만 GitHub 로그인이 더 간단
3. 대시보드에서 "New Project" 클릭
4. Organization: 개인 계정이면 자동으로 만들어진 Organization 선택
5. Project name: 예) `kanbanboard`
6. Database Password: 강력한 비밀번호를 설정하고 별도로 안전하게 보관
   (비밀번호 관리자 등에 저장 — 이 비밀번호는 이후 프론트엔드 코드에서는
   사용하지 않음, DB 콘솔 직접 접속 시에만 필요)
7. Region: 가능하면 가까운 지역(예: Northeast Asia, Seoul이 있으면 그것) 선택
8. "Create new project" 클릭 후 프로비저닝 완료까지 1~2분 대기

## 2. `cards` 테이블 생성 (SQL Editor)

1. 왼쪽 메뉴 "SQL Editor" 클릭 → "New query"
2. 아래 SQL을 그대로 붙여넣고 실행(Run) — `DatabaseDesign.md`에 있는 것과 동일

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

3. 에러 없이 "Success"가 표시되는지 확인
4. 왼쪽 메뉴 "Table Editor" → `cards` 테이블 클릭 → 컬럼(`id`, `text`, `status`,
   `created_at`)이 의도한 대로 만들어졌는지 육안으로 확인

## 3. API 키 확인

1. 왼쪽 메뉴 하단 "Project Settings"(톱니바퀴 아이콘) → "API" 클릭
2. "Project URL" 값 복사 (예: `https://abcdxyz.supabase.co`)
3. "Project API keys" 섹션에서 **anon public** 키 값 복사
4. **주의**: 같은 화면의 `service_role` 키는 절대 복사/사용하지 않는다
   (이 키를 프론트엔드에 넣으면 RLS를 우회해 누구나 DB 전체를 제어할 수 있게 됨)

## 4. 로컬 코드에 반영

1. `src/exercise/jjin/day02/kanbanboard/supabaseClient.js` 열기
2. `SUPABASE_URL` 값을 2번에서 복사한 Project URL로 교체
3. `SUPABASE_ANON_KEY` 값을 anon public 키로 교체
4. 저장

```js
// 예시 (실제 값으로 교체)
const SUPABASE_URL = "https://abcdxyz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

## 5. 동작 확인

1. 로컬에서 `index.html`을 브라우저로 직접 열기(또는 `python3 -m http.server`
   같은 정적 서버로 서빙)
2. 카드 추가 → Supabase 대시보드 "Table Editor"에서 새 행이 실제로 보이는지 확인
3. 카드를 다른 컬럼으로 드래그 이동 → 해당 행의 `status` 값이 바뀌는지 확인
4. 카드 삭제 → 해당 행이 테이블에서 삭제되는지 확인
5. 새로고침, 그리고 다른 브라우저(시크릿 창)로 열었을 때도 동일한 카드 목록이
   보이는지 확인
6. 화면 상단에 빨간 오류 배너(`error-banner`)가 뜨지 않으면 정상 연동된 것

## 6. GitHub Pages로 배포할 때 참고

- [GITHUB_PAGES.md](./GITHUB_PAGES.md) 참고
- 배포 repo에도 실제 URL/anon key가 들어간 `supabaseClient.js`가 그대로
  커밋된다. anon key는 공개를 전제로 한 키라 커밋해도 되지만, 2번에서 설정한
  RLS 정책이 반드시 켜져 있어야 한다 — RLS 없이 anon key만 공개되면 그 키를
  본 누구나 테이블을 마음대로 읽고 쓸 수 있게 된다.

## 7. 참고: 나중에 신경 쓰면 되는 것 (지금 당장 필요 없음)

- **무료 플랜(Free tier) 자동 일시정지**: 프로젝트에 7일 이상 API 요청이 없으면
  Supabase가 프로젝트를 자동으로 일시정지(pause)할 수 있다. 재개는 대시보드에서
  "Restore project" 버튼 클릭으로 가능
- **사용자 인증(Supabase Auth)**: 지금은 로그인 없이 anon key로 누구나 접근
  가능한 구조다. 실제 서비스로 확장하려면 Supabase Auth를 붙이고 RLS 정책을
  `auth.uid()` 기준으로 강화해야 한다(`PRD.md`/`DatabaseDesign.md`의 "향후 확장"
  참고, 현재 실습 범위 밖)
