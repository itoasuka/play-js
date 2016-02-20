import com.typesafe.sbt.packager.universal.UniversalPlugin.autoImport._
import com.typesafe.sbt.web.Import._
import play.sbt.PlayImport.PlayKeys._
import play.sbt.PlayRunHook
import sbt.Keys._
import sbt._

object PlayGulp {

  lazy val gulpDirectory = SettingKey[File]("gulp-directory", "gulp directory")
  lazy val gulpFile = SettingKey[String]("gulp-file", "gulpfile")
  lazy val gulpExcludes = SettingKey[Seq[String]]("gulp-excludes")
  lazy val gulp = InputKey[Unit]("gulp", "Task to run gulp")
  lazy val gulpBuild = TaskKey[Int]("gulp-dist", "Task to run dist gulp")
  lazy val gulpClean = TaskKey[Unit]("gulp-clean", "Task to run gulp clean")
  lazy val gulpTest = TaskKey[Unit]("gulp-test", "Task to run gulp test")

  val playGulpSettings: Seq[Setting[_]] = Seq(

    // Specifies the location of the root directory of the Gulp project relative to the Play app root
    gulpDirectory <<= (baseDirectory in Compile) { _ / "ui" },

    gulpFile := "gulpfile.js",

    gulp := {
      val base = (gulpDirectory in Compile).value
      val gulpfileName = (gulpFile in Compile).value
      runGulp(base, gulpfileName, Def.spaceDelimited("<arg>").parsed.toList).exitValue()
    },

    gulpBuild := {
      val base = (gulpDirectory in Compile).value
      val gulpfileName = (gulpFile in Compile).value
      val result = runGulp(base, gulpfileName, List("build")).exitValue()
      if (result == 0) {
        result
      } else throw new Exception("gulp failed")
    },

    gulpClean := {
      val base = (gulpDirectory in Compile).value
      val gulpfileName = (gulpFile in Compile).value
      val result = runGulp(base, gulpfileName, List("clean")).exitValue()
      if (result != 0) throw new Exception("gulp failed")
    },

    gulpTest := {
      val base = (gulpDirectory in Compile).value
      val gulpfileName = (gulpFile in Compile).value
      val result = runGulp(base, gulpfileName, List("build", "test")).exitValue()
      if (result != 0) throw new Exception("gulp failed")
    },

    // Executes `gulp build` before `sbt dist`
    dist <<= dist dependsOn gulpBuild,

    // Executes `gulp build` before `sbt stage`
    stage <<= stage dependsOn gulpBuild,

    // Executes `gulp clean` before `sbt clean`
    clean <<= clean dependsOn gulpClean,

    // Executes `gulp test` before `sbt test` (optional)
    (test in Test) <<= (test in Test) dependsOn gulpTest,

    // Ensures that static assets in the ui/dist directory are packaged into
    // target/scala-2.11/play-gulp_2.11-1.0.0-web-asset.jar/public when the play app is compiled
    unmanagedResourceDirectories in Assets <+= (gulpDirectory in Compile)(_ / "build/assets"),

    // Starts the gulp watch task before sbt run
    playRunHooks <+= (gulpDirectory, gulpFile).map {
      (base, fileName) => GulpWatch(base, fileName)
    },

    // Allows all the specified commands below to be run within sbt in addition to gulp
    commands <++= gulpDirectory {
      base =>
        Seq(
          "npm"
        ).map(cmd(_, base))
    }
  )

  private def runGulp(base: sbt.File, fileName: String, args: List[String] = List.empty): Process = {
    val maybeColorless = Option(System.getProperty("sbt.log.noformat")).filter(_.toLowerCase == "true").map(_ => "--COLORLESS")
    if (System.getProperty("os.name").startsWith("Windows")) {
      val process: ProcessBuilder = Process("cmd" :: "/c" :: "gulp" :: "--gulpfile=" + fileName :: args ::: maybeColorless.toList, base)
      println(s"Will run: ${process.toString} in ${base.getPath}")
      process.run()
    } else {
      val process: ProcessBuilder = Process("gulp" :: "--gulpfile=" + fileName :: args ::: maybeColorless.toList , base)
      println(s"Will run: ${process.toString} in ${base.getPath}")
      process.run()
    }
  }

  import scala.language.postfixOps

  private def cmd(name: String, base: File): Command = {
    if (!base.exists()) {
      base.mkdirs()
    }
    Command.args(name, "<" + name + "-command>") {
      (state, args) =>
        if (System.getProperty("os.name").startsWith("Windows")) {
          Process("cmd" :: "/c" :: name :: args.toList, base) !<
        } else {
          Process(name :: args.toList, base) !<
        }
        state
    }
  }

  object GulpWatch {

    def apply(base: File, fileName: String): PlayRunHook = {

      object GulpSubProcessHook extends PlayRunHook {

        var process: Option[Process] = None

        override def beforeStarted(): Unit = {
          process = Some(runGulp(base, fileName, "watch" :: Nil))
        }

        override def afterStopped(): Unit = {
          process.foreach(_.destroy())
          process = None
        }
      }

      GulpSubProcessHook
    }

  }

}