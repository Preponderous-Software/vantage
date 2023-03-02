package uk.co.renbinden.vantage.endpoint.api.v2.login

import org.http4k.core.Body
import org.http4k.format.Gson.auto
import uk.co.renbinden.vantage.user.UserId

data class LoginResponse(
    val token: String,
    val userId: UserId,
    val username: String
) {
    companion object {
        val lens = Body.auto<LoginResponse>().toLens()
    }
}