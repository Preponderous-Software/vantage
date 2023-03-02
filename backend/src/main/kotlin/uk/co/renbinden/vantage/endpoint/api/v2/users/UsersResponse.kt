package uk.co.renbinden.vantage.endpoint.api.v2.users

import org.http4k.core.Body
import org.http4k.format.Gson.auto
import uk.co.renbinden.vantage.endpoint.api.v2.PaginationResponse
import uk.co.renbinden.vantage.endpoint.api.v2.user.UserResponse

data class UsersResponse(
    val users: List<UserResponse>,
    val pagination: PaginationResponse
) {
    companion object {
        val lens = Body.auto<UsersResponse>().toLens()
    }
}