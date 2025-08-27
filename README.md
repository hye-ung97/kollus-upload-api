# Kollus Upload API

Kollus Upload API TypeScript 라이브러리와 테스트 페이지입니다.

## 🚀 배포된 사이트

GitHub Pages를 통해 배포된 사이트: https://[your-username].github.io/kollus/

## 📦 설치 및 실행

### 로컬 개발

```bash
# 의존성 설치
npm install

# TypeScript 빌드
npm run build

# 개발 서버 실행
npm start
```

### 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

1. GitHub 저장소에 코드를 푸시
2. GitHub 저장소 설정에서 Pages 활성화
3. `main` 또는 `master` 브랜치에 푸시하면 자동 배포

## 🛠️ 기술 스택

- TypeScript
- HTML/CSS/JavaScript
- GitHub Actions
- GitHub Pages

## 📁 프로젝트 구조

```
kollus/
├── src/
│   └── index.ts          # TypeScript 소스 코드
├── dist/                 # 빌드된 JavaScript 파일
├── index.html           # 테스트 페이지
├── package.json         # 프로젝트 설정
├── tsconfig.json        # TypeScript 설정
└── .github/workflows/   # GitHub Actions 워크플로우
    └── deploy.yml
```

## 🔧 GitHub Pages 설정

1. GitHub 저장소로 이동
2. Settings > Pages
3. Source를 "Deploy from a branch"로 설정
4. Branch를 "gh-pages"로 설정
5. Save 클릭

## 📝 사용법

1. Access Token과 Category Key를 입력
2. "업로드 URL 생성" 버튼 클릭
3. 생성된 업로드 URL로 파일 업로드

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## �� 라이선스

MIT License
