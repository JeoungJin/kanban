# Design System - 칸반보드

`style.css`에 실제 사용된 값을 기준으로 정리한 디자인 토큰과 컴포넌트 가이드.

## 1. 색상

| 토큰            | 값                    | 용도                                  |
|-----------------|-----------------------|---------------------------------------|
| bg-page         | `#f0f2f5`              | 전체 페이지 배경                       |
| bg-header       | `#1a1a2e`              | 헤더 배경                              |
| text-header     | `#ffffff`              | 헤더 위 텍스트                         |
| bg-column       | `#e9ebf0`              | 컬럼(To Do/In Progress/Done) 배경      |
| text-column-title | `#444444`            | 컬럼 제목 텍스트                       |
| bg-count-badge  | `#d4d7de`              | 카드 개수 배지 배경                    |
| text-count-badge| `#333333`              | 카드 개수 배지 텍스트                  |
| bg-card         | `#ffffff`              | 카드 배경                              |
| shadow-card     | `rgba(0,0,0,0.12)`     | 카드 그림자 (`0 1px 3px`)              |
| accent          | `#4f8cff`              | 기본 버튼 배경, 드롭 대상 강조 테두리   |
| accent-hover    | `#3a75e0`              | 버튼 hover 상태                        |
| bg-drag-over    | `#dbe6ff`              | 드롭 대상 컬럼 강조 배경               |
| text-delete     | `#999999`              | 카드 삭제 버튼(기본)                   |
| text-delete-hover | `#e0453f`            | 카드 삭제 버튼 hover(경고색)           |
| text-body       | `#1a1a2e`              | 본문 기본 텍스트 색상                  |

## 2. 타이포그래피

- 폰트: `-apple-system, BlinkMacSystemFont, "Segoe UI", Pretendard, Roboto, sans-serif`
  (시스템 기본 폰트 우선, 별도 웹폰트 로드 없음)
- 크기:
  - 페이지 제목(`h1`): `22px`
  - 컬럼 제목: `15px`
  - 카드 텍스트 / 입력창: `14px`
  - 카드 개수 배지: `12px`

## 3. 여백 및 형태

- 모서리 둥글기: 버튼/입력창 `6px`, 카드/컬럼 `8~10px`, 배지 `10px`(캡슐형)
- 헤더 padding: `20px 32px`
- 컬럼 padding: `12px`, 카드 padding: `12px 14px`
- 컬럼 간 간격(그리드 gap): `16px`, 카드 간 간격: `10px`
- 보드 최대 너비: `1100px` (가운데 정렬)
- 컬럼 최소 높이: `500px`

## 4. 레이아웃

- 헤더: flex, 좌측 제목 / 우측 카드 추가 폼, 좁은 화면에서 줄바꿈(`flex-wrap: wrap`)
- 보드: `grid-template-columns: repeat(3, 1fr)` — 데스크톱 3열
- 반응형 브레이크포인트: `max-width: 720px`에서 보드가 1열(`grid-template-columns: 1fr`)로 전환

## 5. 컴포넌트

- **버튼(기본/추가)**: `accent` 배경, 흰 글자, 굵게(`font-weight: 600`), hover 시
  `accent-hover`
- **카드**: 흰 배경 + 옅은 그림자, `cursor: grab`으로 드래그 가능함을 시각적으로 암시,
  텍스트와 삭제 버튼을 좌우로 배치(`justify-content: space-between`)
- **카드 삭제 버튼**: 아이콘형 텍스트 버튼(`✕`), 기본은 회색, hover 시 빨간 계열로
  경고 의미 부여
- **컬럼 개수 배지**: 캡슐형 회색 배지, 컬럼 제목 옆에 표시

## 6. 상태(State) 스타일

- **드래그 중인 카드** (`.card.dragging`): `opacity: 0.4`로 반투명 처리하여 원래
  자리에서 이동 중임을 표시
- **드롭 대상 컬럼** (`.card-list.drag-over`): 연한 파란 배경(`bg-drag-over`) +
  파란 점선 테두리(`2px dashed accent`)로 드롭 가능 영역을 명확히 표시
- **버튼/삭제 hover**: 배경(또는 텍스트) 색을 진하게/경고색으로 전환하여 상호작용
  가능함을 표시
