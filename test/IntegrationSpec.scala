import org.junit.runner._
import org.scalatest.junit.JUnitRunner
import org.scalatestplus.play.{BrowserInfo, AllBrowsersPerSuite, ChromeInfo, FirefoxInfo, OneServerPerSuite, PlaySpec}

/**
  * add your integration spec here.
  * An integration test will fire up a whole play application in a real (or headless) browser
  */
@RunWith(classOf[JUnitRunner])
class IntegrationSpec extends PlaySpec with OneServerPerSuite with AllBrowsersPerSuite {

  override lazy val browsers = Vector(
    FirefoxInfo(firefoxProfile),
    ChromeInfo
  )

  def sharedTests(browser: BrowserInfo) = {
    "Application" must {

      "ブラウザで稼働する " + browser.name in {

        go to ("http://localhost:" + port)

        pageTitle mustEqual "Hello, world!"

        eventually {
          find(className("greeting")).get.text mustEqual "こんにちは、世界！"
        }
      }
    }
  }
}
