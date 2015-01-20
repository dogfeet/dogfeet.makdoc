# git: AngularJS Git Commit Message Conventions

이 글은 [AngularJS Git Commit Message Conventions][origin]를 번역한 글이다. 어쩌다 공개된 것 같기도 해서 문의했는데 흔쾌히 번역을 허락해 줬다. 내가 여태껏 봤었던 커밋 메시지에 대한 글 중에서 가장 구체적이고 실질적일 뿐만 아니라 [grunt-conventional-changelog][]라는 스크립트까지 공개돼 있다.

이 가이드에 따라서 커밋 메시지를 남기는 것을 연습 중이다. 히스토리가 좀 더 읽기 좋아졌지만, CHANGELOG를 남기고 싶어질 만한 일을 아직 하지 못했다. 아직 뭐가 어떻게 좋은지 표현하기 어렵다.

이 글에 따라 커밋 메시지를 작성하고 [grunt-conventional-changelog][]로 생성한 CHANGELOG를 한번 구경하고 읽자:

* https://github.com/btford/grunt-conventional-changelog/blob/master/CHANGELOG.md
* https://github.com/karma-runner/karma/blob/master/CHANGELOG.md


![](/articles/2013/angularjs-git-commit-message-conventions/angularjs-git-lg.png)

## AngularJS Git Commit Message Conventions

### 요약

* CHANGELOG.md를 스크립트로 생성한다.
* `git bisect`로 중요하지 않은 커밋은 그냥 넘긴다.
* 히스토리에 유의미한 정보를 많이 남긴다.

#### CHANGELOG.md 생성하기

우리는 CHANGELOG를 만들 때 새 기능(Feature), 버그 픽스, 주목할만한 변화(Breaking Changes) 이렇게 세 가지 정보를 남기려고 한다. 이 세 가지 정보와 관련된 커밋을 이용해서 생성하는데 배포하기 전에 스크립트를 돌려서 생성한다. 생성하고 나서 손으로 수정할 때도 있지만, 수정한다고 해도 기본 왁구를 잡아주기 때문에 매우 유용하다.

마지막으로 배포한 후부터 만들어진 모든 커밋 목록 보기(커밋 메시지의 첫 줄만 나온다):

```
git log <last tag> HEAD --pretty=format:%s
```

이번에 배포하는 새 기능 조회:

```
git log <last release> HEAD --grep feature
```

#### 사소한 커밋 식별하기

들여쓰기를 하거나, 공백을 추가/삭제하거나, 빠트린 세미콜론을 넣었을 뿐이거나, 주석을 수정한 커밋들은 어떻게 처리해야 할까? 우리가 무언가 찾을 때 로직을 변경하지 않은 커밋은 무시할 수 있다.

`git bisect`를 이용해서 무시한다:

```
git bisect skip $(git rev-list --grep irrelevant <good place> HEAD)
```

#### 히스토리에는 어떤 정보를 남기면 좋을까?

일종의 컨텍스트 정보도 넣으면 좋다.

아래의 메지시는 컨텍스트 정보의 예인데 [angularjs](https://github.com/angular/angular.js) 커밋에서 추출한 메시지다:

* Fix small typo in docs widget (tutorial instructions)
* Fix test for scenario.Application - should remove old iframe
* docs - various doc fixes
* docs - stripping extra new lines
* Replaced double line break with single when text is fetched from Google
* Added support for properties in documentation

뭘 고쳤는지에 대한 정보가 커밋 메시지에 들어 있긴 하지만 일관된 형식으로 작성하진 않았다.

다른 메시지를 보자:

* fix comment stripping
* fixing broken links
* Bit of refactoring
* Check whether links do exist and throw exception
* Fix sitemap include (to work on case sensitive linux)

이 메시지를 보고 뭘 고친 것인지 알 수 있을까? 여기에는 무엇을 고쳤다는 컨텍스트 정보가 없다.
docs, docs-parser, compiler, scenario-runner 등등의 정보가 있으면 무엇을 고쳤는지 짐작할 수 있을 것이다.

물론, 어떤 파일이 변경됐는지 확인해보면 무엇을 수정했는지 알 수 있다. 하지만, 좀 번거롭다. 나는 히스토리를 조회하는 것만으로도 무엇을 고친 것인지 안다. 단지 컨벤션에 따라 작성하지 않았을 뿐이다.

### 커밋 메시시 포멧

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

첫 줄은 70자를 넘지 않아야 한다. 아시다시피 두 번째 줄은 블랭크이고 그다음부터는 80자를 넘지 않아야 한다. 이렇게 작성하면 GitHub에서 읽을 때도 편하고 다른 도구를 사용할 때도 편하다.

#### Subject

`<subject>` 줄에는 무엇이 달라졌는지 간략하게 기술한다.

##### `<type>`에 작성하는 것

* feat (feature)
* fix (bug fix)
* docs (documentation)
* style (formatting, missing semi colons, …)
* refactor
* test (when adding missing tests)
* chore (maintain)

##### `<scope>`에 넣는 것

여기에는 무엇을 수정했는지 적는다. 예를 들어 $location, $browser, $compile, $rootScope, ngHref, ngClick, ngView라고 적으면 되겠다.

> 역주: Angular.js에서 `스코프`는 특별한 컨텍스트(or 네임스페이스)를 지칭하는 용어다. 일반적인 언어의 스코프와 상통하는 면이 있기도 하지만 다르다. 자세한 내용은 [Angular.js 튜토리얼](http://docs.angularjs.org/tutorial)을 참고한다.
> 하지만 일반적인 의미의 스코프로 해석해서, Angular.js가 아닌 다른 프로젝트의 모듈이나 패키지를 넣어도 무방하다고 생각한다. 도대체 어디를 고쳤는지 적는 용도로 쓰면 좋겠다.

##### `<subject>`에 허용되는 것.

* 군더더기 없이 간략하게 현재형으로 적는다: 'changed'나 'changes'가 아니라 'change'로 적는다.
* 굳이 첫 문자를 대문자로 적지 않는다.
* 문장 끝에 마침표(.)로 끝내지 않는다.

#### 메시지 바디

* `<subject>`와 마찬가지로 군더더기 없이 간략하게 현재형으로 적는다: 'changed'나 'changes'가 아니라 'change'로 적는다.
* 기존과 무엇이 달라졌고 왜 수정했는지에 대한 내용이 들어가야 한다.

* http://365git.tumblr.com/post/3308646748/writing-git-commit-messages
* http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html

#### 메시지 푸터

##### 주요 변경 내용(Breaking changes)

주요 변경 내용은 푸터에 언급한다. 무엇을 고쳤는지, 왜 고쳤는지, 마이그레이션은 어떻게 해야 하는지 설명한다.

> 역주 - 예제는 번역하지 않았다. 튜토리얼을 봤는데도 Angularjs에 대한 이해가 여전히 부족하다. 그리고 [grunt-conventional-changelog][]를 그대로 사용하려면 인식 가능하도록 주요 용어는 영어를 사용해야 한다.

```
BREAKING CHANGE: isolate scope bindings definition has changed and
the inject option for the directive controller injection was removed.

To migrate the code follow the example below:

Before:

scope: {
  myAttr: 'attribute',
  myBind: 'bind',
  myExpression: 'expression',
  myEval: 'evaluate',
  myAccessor: 'accessor'
}

After:

scope: {
  myAttr: '@',
  myBind: '@',
  myExpression: '&',
  // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
  myAccessor: '=' // in directive's template change myAccessor() to myAccessor
}

The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

```
BREAKING CHANGE: isolate scope bindings definition has changed and
the inject option for the directive controller injection was removed.

To migrate the code follow the example below:

Before:

scope: {
  myAttr: 'attribute',
  myBind: 'bind',
  myExpression: 'expression',
  myEval: 'evaluate',
  myAccessor: 'accessor'
}

After:

scope: {
  myAttr: '@',
  myBind: '@',
  myExpression: '&',
  // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
  myAccessor: '=' // in directive's template change myAccessor() to myAccessor
}

The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

##### 이슈 번호 넣기

이슈 번호는 푸터에 별도 라인으로 넣는다. 이 이슈 라인은 "Closes"로 시작한다:


```
Closes #234
```

이슈를 여러 개 넣어도 된다:

```
Closes #123, #245, #992
```

> 역주: Close(s)와 이슈 번호를 커밋 메시지에 넣어 GitHub에 Push하면 해당 이슈가 자동으로 닫힌다.

[origin]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/
[grunt-conventional-changelog]: https://github.com/btford/grunt-conventional-changelog

### Examples

---------------------------------------

** Feat($browser): onUrlChange event (popstate/hashchange/polling) **

Added new event to $browser:

- forward popstate event if available
- forward hashchange event if popstate not available
- do polling when neither popstate nor hashchange available

** Breaks $browser.onHashChange, which was removed (use onUrlChange instead) **

---------------------------------------

** fix($compile): couple of unit tests for IE9 **

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

** Closes `#392` **
** Breaks foo.bar api, foo.baz should be used instead **

---------------------------------------

** feat(directive): ng:disabled, ng:checked, ng:multiple, ng:readonly, ng:selected **

New directives for proper binding these attributes in older browsers (IE).
Added coresponding description, live examples and e2e tests.

** Closes `#351` **

---------------------------------------

** style($location): add couple of missing semi colons **

---------------------------------------

** docs(guide): updated fixed docs from Google Docs **

Couple of typos fixed:

- indentation
- batchLogbatchLog -> batchLog
- start periodic checking
- missing brace

---------------------------------------

** feat($compile): simplify isolate scope bindings **

Changed the isolate scope binding options to:
  - `@attr` - attribute binding (including interpolation)
  - =model - by-directional model binding
  - &expr - expression execution binding

This change simplifies the terminology as well as
number of choices available to the developer. It
also supports local name aliasing from the parent.

**BREAKING CHANGE**: isolate scope bindings definition has changed and
the inject option for the directive controller injection was removed.

To migrate the code follow the example below:

```
Before:

scope: {
  myAttr: 'attribute',
  myBind: 'bind',
  myExpression: 'expression',
  myEval: 'evaluate',
  myAccessor: 'accessor'
}

After:

scope: {
  myAttr: '@',
  myBind: '@',
  myExpression: '&',
  // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
  myAccessor: '=' // in directive's template change myAccessor() to myAccessor
}
```

The removed \`inject\` wasn't generaly useful for directives so there should be no code using it.
