package controllers

import play.api.libs.json.Json
import play.api.mvc._

class Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def greetingApi = Action {
    Ok(Json.obj("greeting" -> "こんにちは、世界！"))
  }
}
