package controllers

import play.api.libs.json.Json
import play.api.mvc._

class Application extends Controller {

  def index: Action[AnyContent] = Action {
    Ok(views.html.index())
  }

  def greetingApi: Action[AnyContent] = Action {
    Ok(Json.obj("greeting" -> "こんにちは、世界！"))
  }
}
