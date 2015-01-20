# grunt: 비동기 타스크

grunt 문서는 비동기 타스크를 자세히 설명하지 않는다. 그래서 처음에 오해하고 삽질을 약간 할 수도 있다(나는 했다--;).

이 글은 비동기 타스크를 왜 쓰고 언제 어떻게 써야 하는지 설명한다.

![](/articles/2013/grunt-async-task/information-boards.jpg)

## 비동기 타스크

우선 setTimeout으로 간단한 비동기 타스크를 하나 만들어 보자.

afterseconds라는 이름의 타스크를 만든다:

```
module.exports = function(grunt) {

  grunt.registerTask('afterseconds', 'done after a few seconds', function() {
    var done = this.async();

    console.log(new Date());

    setTimeout(function(){
      console.log(new Date());
      done();
    }, 2000);
  });

};
```

이 타스크는 2초 후에 완료하는 타스크다.

Gruntfile.coffee도 만들자:

```
module.exports = (grunt)->
  ...

  grunt.loadTasks 'tasks'

  # Default task.
  grunt.registerTask 'default', ['afterseconds', 'jshint']

```

`grunt`라고 실행하면 `afterseconds`, `jshint`를 차례대로 실행한다:

```
$ grunt
Running "afterseconds" task
Fri Sep 06 2013 02:24:01 GMT+0900 (KST)
Fri Sep 06 2013 02:24:03 GMT+0900 (KST)

Running "jshint:tasks" (jshint) task
>> 0 files linted. Please check your ignored files.
```

이처럼 간단하게 비동기 타스크를 만들 수 있다.

## grunt 비동기 구현

grunt는 내부에 타스크 큐를 가지고 있다. 우리가 타스크를 실행하면 즉시 실행되는 것이 아니라 일단 큐에 등록되고 다음 틱에 실행된다.

그 큐에 등록된 타스크는 차례대로 수행된다. 앞 타스크가 끝나야 다음 타스크가 실행된다. 위 예제에서는 'afterseconds', 'jshint' 타스크가 순서대로 등록됐고 'afterseconds'는 2초 후에 끝나므로 2초 후에 'jshint'가 실행된다.

`var done = this.async();`의 async() 함수를 살펴보자:

```
// When called, sets the async flag and returns a function that can
// be used to continue processing the queue.
context.async = function() {
  async = true;

  // The returned function should execute asynchronously in case
  // someone tries to do this.async()(); inside a task (WTF).
  return function(success) {
    setTimeout(function() { complete(success); }, 1);
  };
};
```

내부의 async 변수를 true바꾸고 done 함수를 리턴한다.

타스크를 실행시키는 grunt 코드는 아래와 같다:

```
try {
  // Get the current task and run it, setting `this` inside the task
  // function to be something useful.
  var success = fn.call(context);
  // If the async flag wasn't set, process the next task in the queue.
  if (!async) {
    complete(success);
  }
} catch (err) {
  complete(err);
}
```

`fn.call(context)`가 타스크를 실행하는 부분이고 async 값을 검사해서 동기일 때는 `complete(success)`를 바로 실행해서 타스크를 완료시키고 비동기일 때는 `done()`이 실행될 때까지 연기된다.

### async()는 왜 필요할까?

간단한 node 프로그램에서는 아래와 같이 코드를 작성해서 실행하면 2초 후에 callback까지 실행되고 나서 프로그램이 종료한다:

```
console.log(new Date());

setTimeout(function(){
  console.log(new Date());
}, 2000);
```

하지만, grunt에서는 그렇지 않다. 위 예제의 타스크를 동기 타스크로 수정해보자:

```
module.exports = function(grunt) {

  grunt.registerTask('afterseconds', 'done after some seconds', function() {
    console.log(new Date());

    setTimeout(function(){
      console.log(new Date());
    }, 2000);
  });

};
```

그리고 `grunt`를 실행하면 2초 후에 callback이 실행되지 않고 바로 종료한다:

```
$ grunt
Running "afterseconds" task
Fri Sep 06 2013 03:20:08 GMT+0900 (KST)

Running "jshint:tasks" (jshint) task
>> 0 files linted. Please check your ignored files.

Done, without errors.
```

처음 타스크를 구현할 때는 비동기로 IO를 처리하면 타스크를 병렬로 실행할 수 있어서 자동화 시간이 단축될 거라고 생각했다(메뉴얼에서 그다지 자세히 설명하지 않으므로). 그런데 IO가 끝나지도 않았는데 grunt 프로세스가 종료돼 버렸다. 모든 callback이 실행될 때까지 기다려주는 일반적인 node 프로그램과 동작이 달라서 처음에는 조금 헷갈릴 수 있다.

`async()`라는 이름과 다르게 grunt의 타스크 큐는 차례대로 실행돼야 한다는 점을 명심해야 한다. 'async()'를 사용하는 이유를 간단히 말해보자면 **비동기 코드로 타스크가 차례대로 실행되지 못할 상황에 놓일 때 `async()` 함수로 타스크가 차례대로 실행되게 만드는 것이다**.

### grunt의 한계

grunt의 타스크 큐는 차례대로 실행되므로 타스크를 병렬로 실행할 방법은 없다.

플러그인인 [grunt-parallel](https://github.com/iammerrick/grunt-parallel) 타스크를 쓰면 타스크를 병렬로 실행할 수 있다. 이 타스크는 grunt 프로세스를 여러 개 띄워서 병렬로 다른 타스크들을 실행시켜 준다.

Async.js처럼 다양하게 flow control를 할 수 있으면 좋지 않을까? 다음이나 다음다음 버전을 기대해본다.
