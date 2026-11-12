# 개인 게임 라이브러리 — GitHub Pages 버전

로그인이나 서버 없이 `games.json`만 수정해 게임을 등록할 수 있는 정적 웹사이트입니다.

## 기능
- 게임 이미지, 제목, 설명, 플랫폼, 버전, 업데이트 날짜, 개발 상태 표시
- 전체 / 웹 / PC / 모바일 필터 및 이름 검색
- 게임 상세 정보 창
- 웹 게임 실행 링크, PC 빌드 다운로드 링크
- 실행 주소가 비어 있으면 버튼 자동 비활성화
- PC와 휴대전화 화면에 대응

## 1. GitHub Pages 배포하기
1. GitHub에서 새 저장소를 만듭니다. 예: `my-game-library`. 공개(Public) 저장소가 간단합니다.
2. 이 폴더의 **내용물**(`index.html`, `games.json`, `assets/` 등)을 저장소 **최상위 경로**에 업로드합니다. 폴더 전체를 한 단계 아래로 넣지 마세요.
3. GitHub 저장소의 **Settings → Pages → Build and deployment → Source: Deploy from a branch**를 선택합니다.
4. Branch를 `main`, 폴더를 `/(root)`로 선택하고 Save합니다.
5. Pages에서 표시되는 주소로 접속합니다. 보통 `https://사용자명.github.io/저장소명/` 입니다. 배포에 잠시 시간이 걸릴 수 있습니다.

참고: GitHub Pages 사이트는 공개 배포입니다. 비공개 테스트 데이터나 비밀번호를 업로드하지 마세요.

## 2. 게임 추가하기
`games.json`의 `games` 배열에 아래와 같은 객체를 하나 더 넣습니다.

```json
{
  "id": "my-second-game",
  "title": "내 두 번째 게임",
  "description": "짧은 게임 설명",
  "image": "assets/my-second-game.png",
  "version": "0.2.0",
  "updated": "2026-11-12",
  "status": "테스트 중",
  "platforms": ["web", "windows"],
  "playUrl": "games/my-second-game/index.html",
  "downloadUrl": "https://example.com/download.zip",
  "notes": "업데이트 내용이나 테스트 메모"
}
```

- `image`: 사이트 폴더 안 이미지 주소(예: `assets/게임.png`) 또는 HTTPS 이미지 URL. 직접 만든 이미지 사용 권장.
- `platforms`: `web`, `windows`, `android`, `ios`, `mac`, `linux` 중 복수 사용 가능.
- `playUrl`: 웹에서 실행할 HTML 페이지 경로 또는 HTTPS 주소. Web 빌드가 없다면 `""`.
- `downloadUrl`: PC / 모바일 빌드 다운로드용 HTTPS 주소. 아직 없으면 `""`.
- 게임 하나를 추가할 때 앞의 객체와 콤마를 올바르게 구분해야 합니다.
- `games.json`이 유효하지 않은 JSON이면 목록을 읽지 못합니다.

## 3. Unity Web 빌드 올리기
1. Unity에서 **File → Build Profiles → Web**을 추가/선택하고 Web 빌드를 생성합니다. 사용 중인 Unity 버전에 따라 명칭이 조금 다를 수 있습니다.
2. 생성한 Web 빌드의 `index.html`, `Build/`, `TemplateData/` 등 필요한 폴더와 파일을 `games/quark-to-universe/`에 복사합니다.
3. `games.json`의 해당 게임에 `"playUrl": "games/quark-to-universe/index.html"`을 입력합니다.
4. 사이트를 다시 GitHub에 업로드합니다.

**주의**: Unity Web 빌드의 압축 파일은 호스팅 서버의 `Content-Encoding` 설정과 충돌할 수 있습니다. GitHub Pages를 쓸 때는 압축 처리에 주의하고, 필요하면 Unity Web 빌드의 `Decompression Fallback` 설정을 테스트하세요. 용량이 크면 GitHub Pages 대신 Web 게임은 itch.io로 배포하고 `playUrl`을 itch.io 페이지로 연결하는 방식이 더 적합할 수 있습니다.

## 4. PC 실행 파일 링크
Windows `.exe` 파일은 브라우저에서 바로 실행할 수 없습니다. ZIP 등으로 묶고 GitHub Releases나 itch.io에 업로드한 후 `downloadUrl`에 링크하세요. 웹 실행을 지원하지 않는 게임은 `platforms`에서 `web`을 제거합니다.

## 5. 수정·업데이트 방법
- 제목, 버전, 게임 주소 수정: `games.json`
- 카드 / 버튼 / 배경 디자인 수정: `style.css`
- 기능 변경: `script.js`
- 사이트 상단 문구 수정: `index.html`

## 6. 로컬 테스트
`index.html` 파일을 더블 클릭하면 브라우저 보안 제한 때문에 `games.json`을 읽지 못할 수 있습니다. 폴더에서 터미널을 열어 다음을 실행하세요.

```bash
python -m http.server 8000
```

그다음 `http://localhost:8000`에서 확인합니다. Python이 없다면 VS Code Live Server 등의 로컬 HTTP 서버를 이용하세요.

## 7. 참고
- 사이트는 정적 페이지이며 웹에서 파일을 업로드하는 관리자 기능은 없습니다.
- 게임 목록에 개발 중 샘플 1개가 들어 있습니다. 실제 빌드 주소는 비워 두었습니다.
- 중요한 테스트 빌드와 저장 데이터는 별도로 백업하세요.
