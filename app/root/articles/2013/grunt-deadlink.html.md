# grunt-deadlink

grunt에서 동작하는 [죽은 링크를 검사하는 플러그인](https://npmjs.org/package/grunt-deadlink)을 만들었다. 블로그를 운영하는데에 있어서 static generator를 이용한다면 이런것도 해야하지 않나 싶기도하고, 옛날 글들에 있는 링크들이 망가졌을 경우 처치를 해야하지 않을까 (사실 잘 읽지도 않겠지만) 싶어서 만들었다. 아무쪼록 잘 써주시길 바란다. 이 글은 grunt-deadlink를 만들면서 생각난 것들을 정리한 것이다.

![](/articles/2013/grunt-deadlink/404.png)

## 기본적인 동작

deadlink는 다음과 같이 설정한다.

    grunt.loadNpmTasks('grunt-deadlink');

    grunt.config.init({
        deadlink : {
            samplecheck : {
                src : [ ... ]
                expressions : [ ... ]
            }
        }
    });

이렇게 설정하면 src에서 expressions를 찾아 그 링크가 죽었는지 살았는지 알려준다.

- `src` : glob 패턴으로 파일들을 적으면 된다. 예를 들자면 'docs/**/*.md'는 docs 디렉토리 아래의 모든 마크다운 문서들을 나타낸다.
- `expressions` : 자바스크립트의 RegExp 객체들을 적는다. `src`에서 지정하는 파일들 속에서 `expressions`로 링크를 찾아낸다. *반드시 한 쌍의 괄호로 묶인 sub-string이 필요하다.* 이 괄호 안에는 검사하고 싶은 url이 들어간다. 예를 들자면 마크다운은 `[<any string>](<url>)`과 같은 식으로 링크를 설정하는데, 이를 위해서는 `expressions : /\[[^\]]*\]\((http[s]?:\/\/[^\) ]+)/g`와 같이 설정해준다. 링크 방식이 여러개라면 배열로 정의해준다. 아무것도 정의해주지 않았다면 마크다운의 링크만 인식한다.

이 태스크는 일일히 요청을 보내고 받는 일을 하므로 링크가 많을 경우 많은 시간이 걸린다. _개발용 grunt 태스크에는 이 태스크를 넣지 않는 것이 좋다._

## HTTP Client

처음에는 nodejs의 기본 패키지인 `http`와 `https`를 사용하려 했다. 하지만 https가 제대로 동작하지 않았고 redirect (status code 3xx)를 잘 처리할 자신이 없었다. 인터넷 검색을 통해 `request`라는 패키지가 redirect와 https를 잘 지원한다는걸 알고는 적용했다. 결과는 성공적. 하지만 여전히 브라우저/Curl로는 제대로 나오지만 deadlink에서는 이러쿵 저러쿵 에러를 내뱉었다. 이유는 몇 가지가 있었는데, HEAD 메서드를 지원하지 않는 웹서버가 종종 있다거나, 너무 많은 소켓을 한꺼번에 열어서 그렇다거나, 어떠한 이유로 연결이 그냥 끊기는 경우도 있었다. 이런 것들은 GET메서드로 변경(마음에 들지 않는다), connection pooling, 재요청등으로 해결했다.

## RegExp

원하는 문서에서 링크만 뽑아내는 작업은 정규표현식으로 처리했다. 정규표현식으로 인식 불가능한 문법을 사용하는 문서들에겐 유감이지만 현재 가장 간단한 방법이라 생각한다. 우리가 마크다운을 자주 사용하므로 기본 적으로는 마크다운의 링크를 인식하도록 했다. 즉 `[...](url)` 형식이나 `[...]: url`형식으로 쓰여있으면 url만 꺼내서 인식한다. 물론 마크다운 문서에 html형식의 링크가 들어갈수 있지만 무시했다. 나중에 넣겠지.

## 앞으로 할 것

귀찮아서 수정안하고 냅둔 것들. 필요한 분들이 수정해주면 뽀뽀해줄꺼다. 아니 개발자분들에겐 술사준다고 해야하려나?

* ~~결과에 파일 이름 넣기 - 지금은 URL만 출력되는데 URL이 들어있는 파일 이름이 들어가야 한다.~~
* ~~결과를 파일로 저장하는 옵션 만들기 - dead link가 많을 때 화면에 출력되는게 좀 부담스럽더라.~~
* HEAD메서드로 우선 요청하고 '405 Method not allowed'나 '501 Method Unimplemented'응답시 GET메서드로 재요청 하기 - 속도나 네트워크에 부하를 덜 주는 방법이다. 근데 어떤 이유에서인지 잘 안된다.
* 링크 필터링 - expressions에 RegExp뿐만이 아니라 함수를 넣어 링크를 추출하는 과정을 사용자에게 위임하는 기능
* URL 캐싱 - 중복된 URL은 재요청하지 않는다.
* local link test - 로컬 파일로 접근하는 링크들은 아직 고려하지 않았다. 검사하는 파일로부터의 상대경로와 도메인 루트부터의 상대경로 등을 체크해야한다.
* 코드 정리 - (-_-)a