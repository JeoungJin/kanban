# CLAUDE.md

이 파일은 Claude Code가 이 폴더에서 작업할 때 참고하는 안내 문서입니다.

## 폴더 컨텍스트

이 디렉토리(`src/exercise/jjin/day02/kanbanboard`)는 공유 강의 저장소
`kosa-vibecoding-2026-4th` 안에 있는 학생(jjin)의 day02 실습 폴더입니다.
To-do / In Progress / Done 컬럼과 드래그앤드롭 이동 기능을 가진 칸반보드를
HTML + CSS + JS로 만드는 실습입니다. (최초 구현은 삭제되었고, 현재는 이
문서화 규칙에 따라 다시 작업을 진행합니다.)

## 프롬프트 로그 규칙

이 폴더에서 입력되는 모든 프롬프트는 `WorkFlow.md`에 기록합니다.

- 프롬프트는 **원본 그대로** 저장
- 결과는 **요약**해서 저장
- 작은 요청이라도 매 프롬프트마다 `WorkFlow.md`에 새 항목을 이어붙임(누적, 덮어쓰지 않음)

## Git 워크플로우

이 저장소는 여러 사람이 동시에 `main`에 push하므로 `git push`가 자주 거부됩니다.
push 전에는 `git pull`(merge 방식)으로 동기화합니다 — `git rebase`나
`git pull --rebase`는 사용하지 않습니다.
