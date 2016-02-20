Play + JavaScript
=================

このプロジェクトはサーバサイドは [Play Framework](https://www.playframework.com/) で、クライアントサイドは
gulp + webpack + babel で作成するパターンのサンプルです。

sbt で gulp をキックする部分は [この記事](http://qiita.com/mmizutani/items/9def492ea7bbfb35a57a) を~~まるパク~~参考にさせていただきました。

サーバサイド
------------

テストは、[ScalaTest](http://www.scalatest.org/) で書きなおしています。また、ブラウザによるテストは HtmlUnit ではなく Chrome と Firefox
を使用します。また、[Scoverage](http://scoverage.org/) によるカバレッジを取得します。

    sbt clean coverage test coverageReport

test タスクを実行すると、gulp build test も実行します。

run タスクを実行すると、gulp watch も実行します。


クライアントサイド
------------------

[gulp](http://gulpjs.com/) + [webpack](https://webpack.github.io/) + [Babel](https://babeljs.io/) でビルドします。

テストは、[Karma](https://karma-runner.github.io/) + [Mocha](https://mochajs.org/) +
[power-assert](https://github.com/power-assert-js/power-assert) です。Chrome と Firefox でテストします。
Web API 呼び出しの部分は [Sinon.JS](http://sinonjs.org/) を使用したモックを使用しています。

カバレッジもとり、cobertura 形式でレポートを出力します。

### gulp のタスク

|タスク     |説明                                                             |
|-----------|-----------------------------------------------------------------|
|clean      |build ディレクトリを削除します。                                 |
|build      |JavaScript 類を bundle.js というファイル名でひとつにまとめます。 |
|test       |テストを実行します。karma タスクのエイリアスです。               |
|watch      |webpack-dev-server を起動します。                                |
|karma:watch|karma を singleRun: false で起動します。                         |


なぜ Scala.js を使わないのか？
------------------------------

[Scala.js](http://www.scala-js.org/) いいと思うし、Isomorphic の夢も見ているけど、いまだ JavaScript
のライブラリを使おうという動きが中心的で、JavaScript の進化の速さについていってないのが残念なので使わない。
