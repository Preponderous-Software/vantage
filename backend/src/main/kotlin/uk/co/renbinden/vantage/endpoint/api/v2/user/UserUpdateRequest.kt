package uk.co.renbinden.vantage.endpoint.api.v2.user

import org.http4k.core.Body
import org.http4k.format.Gson.auto
import uk.co.renbinden.vantage.user.UserStatus

data class UserUpdateRequest(
    val version: Int,
    val username: String?,
    val password: String?,
    val status: UserStatus?
) {
    companion object {
        val lens = Body.auto<UserUpdateRequest>().toLens()
    }
}