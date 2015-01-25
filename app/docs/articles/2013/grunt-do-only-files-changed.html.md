# grunt: 수정된 파일만 Lint하기

이 글은 예로 Lint를 사용하지만, Watch 이벤트를 다루는 법은 CoffeeScript 스크립트를 컴파일하는 것 때문에 필요했다. Lint는 번개처럼 빠르지만 CoffeeScript 컴파일은 번개같진 않아서 수정한 파일만 다시 컴파일하는 기능이 간절했다.

grunt의 watch 타스크는 아직 완성되지 않은 것 같다. 조금 모호해서 수정한 파일만 다루는게 처음이라면 실수하기 쉽도록 생겼다.

![](/articles/2013/grunt-do-only-files-changed/gruntjs.png)

## Watch 이벤트

먼저 Watch 이벤트를 핸들링하는 방법을 살펴보자. Watch하고 있다가 파일이 수정되면 해당 파일을 Lint하는 워크플로우를 살펴본다.

아래는 [grunt-init-node][]에서 가져왔고 jshint와 watch를 제외한 다른 부분은 생략한다:

```
...
jshint: {
  lib: {
    src: ['lib/**/*.js']
  }
},
watch: {
  lib: {
    files: '<%= jshint.lib.src %>',
    tasks: ['jshint:lib']
  }
}
...
```

'lib/**/*.js'파일이 수정되면 jshint 타스크가 실행된다. 이 때 문제는 수정된 파일만 다시 Lint하는 것이 아니라 모든 파일에 대해 다시 Lint한다.

수정된 파일만 다시 Lint하게 하려면, Watch 이벤트를 직접 핸들링해야 한다. 아래와 같은 코드가 필요하다:

```
...
grunt.event.on('watch', function(action, files, target) {
  grunt.log.writeln(target + ": " + files + " has " + action);
  grunt.config(['jshint', target], {src: files});
});
..
```

'lib/**/*.js' 파일 중에서 하나라도 수정되면 Watch 이벤트가 발생하고 jshint의 설정을 수정해서 jshint 타스크를 실행시킨다. jshint의 설정을 아예 변경해 버리는 방법으로 원래 jshint의 설정이 사라져 버린다. 여기에서 문제가 생긴다. watch는 jshint를 참조하고 있고 jshint의 설정은 변경됐으므로 마지막에 수정된 파일이 이외의 파일에 대해서는 더 이상 Watch 이벤트가 발생하지 않는다.

파일을 정의해주는 부분을 아래와 같이 변경해줘야 한다:

```
...
jshint: {
  lib: {
    src: '<%= watch.lib.files %>'
  }
},
watch: {
  lib: {
    files: ['lib/**/*.js'],
    tasks: ['jshint:lib']
  }
}
...
```

이렇게 하면 jshint의 설정이 달라져도 watch 타스크는 영향받지 않는다.

설정을 백업하거나 watch 전용 타겟을 만들어서 해결할 수도 있지만, 코드는 좀더 복잡해질 수 있다. 수정된 파일만 컨트롤하는 방법은 아직 불완전하다.

이 내용을 [grunt-init-node에 적용해서 PR](https://github.com/gruntjs/grunt-init-node/pull/4)을 보냈는데 거절됐다. watch는 다른 다스크에 종속적이며 watch 이벤트를 핸들링해서 컴파일을 지원하는 것은 권장하지 않는다고 한다. 다른 방법을 고안중이라고 하니 기다려봐야 겠다.

그리고 [grunt-init-node의 다른 이슈](https://github.com/gruntjs/grunt-init-node/issues/3)를 보면 [grunt-init-node] 프로젝트가 yeoman으로 대체될 것이라고 한다. yeoman과 grunt-init은 기능이 중복되는 감이 있었는데, scaffolding은 전적으로 yeoman이 맡게 될 것으로 보인다.

[grunt-init-node]: https://github.com/gruntjs/grunt-init-node
