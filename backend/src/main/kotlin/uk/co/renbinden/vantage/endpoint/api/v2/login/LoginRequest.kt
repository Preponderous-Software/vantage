package uk.co.renbinden.vantage.endpoint.api.v2.login

import org.http4k.core.Body
import org.http4k.format.Gson.auto

data class LoginRequest(val username: String, val password: String) {
    companion object {
        val lens = Body.auto<LoginRequest>().toLens()
    }
}