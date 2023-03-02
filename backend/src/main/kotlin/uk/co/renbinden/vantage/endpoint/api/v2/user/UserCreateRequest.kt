package uk.co.renbinden.vantage.endpoint.api.v2.user

import org.http4k.core.Body
import org.http4k.format.Gson.auto

data class UserCreateRequest(
    val username: String,
    val password: String
) {
    companion object {
        val lens = Body.auto<UserCreateRequest>().toLens()
    }
}