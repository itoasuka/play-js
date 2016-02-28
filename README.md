Play + JavaScript
=================

このプロジェクトはサーバサイドは [Play Framework](https://www.playframework.com/) で、クライアントサイドは
gulp + webpack + babel で作成するパターンのサンプルです。

クライアントサイドプロジェクトは `ui` フォルダに展開する Git サブモジュールです。詳しくは [https://github.com/itoasuka/cs4pf](https://github.com/itoasuka/cs4pf)
を参照してください。

sbt で gulp をキックする部分は [この記事](http://qiita.com/mmizutani/items/9def492ea7bbfb35a57a) を~~まるパク~~参考にさせていただきました。


開発での使い方
--------------

    sbt run

で、play が開発モードで起動するわけですが、同時に browser-sync も起動します。

ブラウザで動作確認する場合は、[http://localhost:3000/](http://localhost:33000/)
にアクセスしてください。browser-sync 経由となり自動リフレッシュ機能の恩恵を得ることもできます。


テスト
------

テストは、[ScalaTest](http://www.scalatest.org/) で書きなおしています。また、ブラウザによるテストは HtmlUnit ではなく Chrome と Firefox
を使用します。また、[Scoverage](http://scoverage.org/) によるカバレッジを取得します。

    sbt clean coverage test coverageReport

test タスクを実行すると、クライアントサイドの `gulp build` も実行します。これによってサーバサイド主導の Selenium
によるテストでもクライアントサイドのアーティファクトを使用することができます。


なぜ Scala.js を使わないのか？
------------------------------

[Scala.js](http://www.scala-js.org/) いいと思うし、Isomorphic の夢も見ているけど、いまだ JavaScript
のライブラリを使おうという動きが中心的で、JavaScript の進化の速さについていってないのが残念なので使わない。
