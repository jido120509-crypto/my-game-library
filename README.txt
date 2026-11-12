이 폴더는 Quark to Universe 웹 빌드를 위한 예시 공간입니다.
Unity Web 빌드의 index.html, Build/, TemplateData/ 등을 이 위치에 복사하세요.
그 후 사이트 루트 games.json의 playUrl을 다음과 같이 설정하세요:
"playUrl": "games/quark-to-universe/index.html"

주의: 실제 Web 빌드가 없다면 playUrl은 빈 문자열로 유지하세요.
PC 빌드는 GitHub Releases나 itch.io 다운로드 URL을 downloadUrl에 넣으세요.
