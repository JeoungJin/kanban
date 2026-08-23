# GitHub Pages 배포 가이드 - 칸반보드

## 1. 배경

- 이 프로젝트는 순수 프론트엔드(HTML/CSS/JS)이므로 GitHub Pages로 무료 정적
  호스팅이 가능하다.
- 현재 코드는 공용 모노 repo `kosa-vibecoding-2026-4th`(수강생 16명이 함께
  쓰는 저장소)의 `src/exercise/jjin/day02/kanbanboard/` 폴더 안에 있다.
- 이 공용 모노 repo에 직접 GitHub Pages를 켜면 저장소 설정(Pages, 브랜치 구조
  등)이 다른 15명의 작업과 얽히게 되므로, **모노 repo와는 별도의 개인 repo**를
  새로 만들어 그 repo에서만 Pages를 사용하는 방식을 쓴다.
- GitHub 계정: `JeoungJin`

## 2. 준비물

- GitHub 계정 `JeoungJin`
- 배포 전용 새 저장소 이름(예: `kanbanboard-pages`) — 이 문서에서는 이 이름을
  예시로 사용, 원하는 이름으로 바꿔도 무방
- 로컬에 이미 있는 `kanbanboard` 폴더(`index.html`, `style.css`, `script.js`,
  `supabaseClient.js` 등)

## 3. 배포 전용 GitHub repo 생성

1. https://github.com/new 접속 (계정 `JeoungJin`으로 로그인된 상태)
2. Repository name에 `kanbanboard-pages` 입력
3. Public으로 생성(Pages 무료 사용 조건). README/추가 파일 없이 빈 저장소로 생성
4. "Create repository" 클릭

## 4. 로컬에서 배포용 폴더 준비 및 최초 push

모노 repo(`kosa-vibecoding-2026-4th`) 바깥의 별도 디렉터리에서 작업한다
(모노 repo의 git 히스토리와 섞이지 않도록).

```bash
# 모노 repo 바깥에 배포용 작업 디렉터리 생성
mkdir -p ~/deploy/kanbanboard-pages
cd ~/deploy/kanbanboard-pages
git init
git remote add origin https://github.com/JeoungJin/kanbanboard-pages.git

# 모노 repo의 kanbanboard 폴더 내용을 복사 (경로는 실제 로컬 경로에 맞게 조정)
cp -r ~/work/kosa-vibecoding-2026-4th/src/exercise/jjin/day02/kanbanboard/* .

git add .
git commit -m "Deploy kanban board to GitHub Pages"
git branch -M main
git push -u origin main
```

## 5. GitHub Pages 활성화

1. 새로 만든 `kanbanboard-pages` 저장소 → Settings → Pages
2. "Build and deployment" → Source: **Deploy from a branch**
3. Branch: `main`, 폴더: `/ (root)` 선택 후 Save
4. 몇 분 뒤 안내되는 주소(예: `https://jeoungjin.github.io/kanbanboard-pages/`)로
   접속해 칸반보드가 정상적으로 뜨는지 확인

## 6. 코드를 수정할 때마다 반복할 일 (동기화)

모노 repo에서 `kanbanboard` 폴더를 계속 수정해도 배포용 repo에는 자동으로
반영되지 않는다. 다음 두 가지 방법 중 하나를 매번 반복한다.

### 방법 A. 수동 복사 (간단, 추천)

```bash
cd ~/deploy/kanbanboard-pages
cp -r ~/work/kosa-vibecoding-2026-4th/src/exercise/jjin/day02/kanbanboard/* .
git add .
git commit -m "Update kanban board"
git push
```

### 방법 B. git subtree로 자동 추출 (선택, 익숙해지면)

```bash
cd ~/work/kosa-vibecoding-2026-4th
git subtree split --prefix=src/exercise/jjin/day02/kanbanboard -b pages-export
git push https://github.com/JeoungJin/kanbanboard-pages.git pages-export:main --force
git branch -D pages-export
```

- **주의**: 마지막 명령은 배포용 repo(`kanbanboard-pages`)의 `main`을 덮어쓰는
  force push다. 모노 repo(`kosa-vibecoding-2026-4th`)에는 영향이 전혀 없고
  본인 소유의 별도 배포 repo에만 적용되므로 비교적 안전하지만, 실행 전에
  배포 repo 쪽에 로컬 복사본 방식(방법 A)으로 남겨둔 다른 변경 사항이 없는지
  확인한 뒤 실행할 것.

## 7. Supabase anon key 노출 관련 주의

- `supabaseClient.js`에 Supabase 프로젝트 URL과 anon key가 그대로 커밋되어
  배포된다. anon key는 브라우저에 노출되는 것을 전제로 설계된 공개 키이지만,
  반드시 Supabase Row Level Security(RLS) 정책으로 접근을 제어해야 한다
  (자세한 설정은 [SUPABASE.md](./SUPABASE.md), [DatabaseDesign.md](./DatabaseDesign.md) 참고)
- 배포용 repo도 Public이므로 이 값이 공개적으로 조회 가능해진다 — 실습 목적으로는
  허용되는 방식이지만, 실제 서비스로 확장할 때는 이런 방식(anon key + 완화된 RLS)을
  그대로 쓰면 안 된다.
