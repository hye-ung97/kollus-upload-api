# 🤖 AI Projects Hub

Claude와 Cursor를 활용하여 만든 AI 프로젝트 모음집

## 🚀 프로젝트 소개

이 프로젝트는 AI 도구들을 활용하여 개발된 다양한 웹 애플리케이션들을 한 곳에서 관리하고 접근할 수 있는 허브입니다.

## 📋 포함된 프로젝트

### 1. 📡 Kollus API Test
- **설명**: Kollus 동영상 플랫폼의 API 기능을 테스트하고 검증할 수 있는 도구
- **파일**: `kollus-api-test.html`
- **기능**: API 엔드포인트 테스트, 응답 검증, 디버깅 도구

### 2. 💰 카카오 26주 적금
- **설명**: 카카오뱅크의 26주 적금 상품 정보와 계산기를 제공하는 페이지
- **파일**: `kakao.html`
- **기능**: 적금 계산, 이자율 비교, 상품 정보 제공

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Animations
- **Build Tools**: TypeScript, npm
- **Deployment**: GitHub Pages

## 📁 프로젝트 구조

```
kollus/
├── src/
│   ├── index.ts          # TypeScript 소스 코드
│   └── kakao/
│       └── index.html    # 카카오 적금 페이지 (이전 버전)
├── dist/                 # 빌드된 JavaScript 파일
├── index.html           # 메인 허브 페이지
├── kollus-api-test.html # Kollus API 테스트 페이지
├── kakao.html           # 카카오 26주 적금 페이지
├── package.json         # 프로젝트 설정
└── tsconfig.json        # TypeScript 설정
```

## 🚀 사용법

1. **메인 페이지 접속**: `index.html`을 브라우저에서 열기
2. **프로젝트 선택**: 원하는 프로젝트 카드를 클릭
3. **기능 사용**: 각 프로젝트의 고유 기능 활용

## 📦 설치 및 실행

### 로컬 개발

```bash
# 의존성 설치
npm install

# TypeScript 빌드
npm run build

# 개발 서버 실행 (선택사항)
# Live Server 확장 프로그램 사용 권장
```

### 배포

이 프로젝트는 GitHub Pages를 통해 배포할 수 있습니다.

1. GitHub 저장소에 코드를 푸시
2. GitHub 저장소 설정에서 Pages 활성화
3. `main` 브랜치에 푸시하면 자동 배포

## 🎨 디자인 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **모던 UI**: 글래스모피즘 효과와 그라데이션 배경
- **부드러운 애니메이션**: 호버 효과와 페이지 로드 애니메이션
- **직관적인 네비게이션**: 카드 기반 프로젝트 선택

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

