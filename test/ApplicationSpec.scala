import org.scalatest.junit.JUnitRunner
import org.scalatestplus.play._
import org.junit.runner._

import play.api.test._
import play.api.test.Helpers._

/**
 * Add your spec here.
 * You can mock out a whole application including requests, plugins etc.
 * For more information, consult the wiki.
 */
@RunWith(classOf[JUnitRunner])
class ApplicationSpec extends PlaySpec with OneAppPerTest {

  "Application" must {

    "send 404 on a bad request" in {
      val Some(result) = route(FakeRequest(GET, "/boum"))
      status(result) mustBe NOT_FOUND
    }

    "render the index page" in {
      val home = route(FakeRequest(GET, "/")).get

      status(home) mustEqual OK
      contentType(home) mustEqual Some("text/html")
      contentAsString(home) must include ("Hello, world!")
    }
  }
}
