# Life
Life는 쉽게 게시판 형 사이트를 구축할 수 있는 [UPPERCASE](http://UPPERCASE.IO)와 [NSP](http://nsp.js.org) 기반의 CMS(Content Management System)입니다.

## 로고 및 아이콘
아래 세가지 파일을 사이트 컨셉에 맞게 만들어, `Life/R`폴더에 넣어줍니다.
* `logo.png`
* `favicon.ico`
* `apple-touch-icon.png` (크기를 180x180으로 만듭니다.)

## 설정
`Life.js` 파일을 수정합니다.
* `CONFIG.Life.domain` 사이트의 도메인 주소입니다.
* `CONFIG.Life.contact` 관리자 이메일 주소입니다.
* `NODE_CONFIG.Life.email` 회원 가입 인증 메일을 보낼때 사용하는 메일 계정의 주소입니다. (현재 Gmail만 작동합니다.)
* `NODE_CONFIG.Life.emailPassword` 회원 가입 인증 메일을 보낼때 사용하는 메일 계정의 비밀번호 입니다. (현재 Gmail만 작동합니다.)

## 이용약관 및 개인정보 수집 및 이용에 대한 안내
`Life/R`폴더의 이하 파일들에 내용을 추가합니다.
* `terms.txt` 이용약관
* `privacy.txt` 개인정보 수집 및 이용에 대한 안내

## 관리자의 DB 수정
관리자의 DB 내용 중 `roles`에 다음 두 문자열을 추가합니다.
* "Admin"
* "Manager"

## 이것으로 만들어진 사이트
* [겜창인생](https://gclife.net)
* [겐트위한](http://gentwihan.com)

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)

![ScreenShot](https://raw.githubusercontent.com/Hanul/Life/master/well-being.gif)