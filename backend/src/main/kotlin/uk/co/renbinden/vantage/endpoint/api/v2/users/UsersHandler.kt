package uk.co.renbinden.vantage.endpoint.api.v2.users

import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK
import org.http4k.core.with
import org.http4k.routing.path
import uk.co.renbinden.vantage.endpoint.api.v2.PaginationResponse
import uk.co.renbinden.vantage.endpoint.api.v2.user.UserResponse
import uk.co.renbinden.vantage.user.User
import uk.co.renbinden.vantage.user.UserRepository

class UsersHandler(
    private val repository: UserRepository
) {

    fun get(request: Request): Response {
        val page = request.path("page")?.toIntOrNull() ?: 0
        val users = repository.getUsers(50, page * 50).map { it.toResponse() }
        val totalUserCount = repository.getUserCount()
        return Response(OK).with(
            UsersResponse.lens of UsersResponse(
                users,
                PaginationResponse(totalUserCount)
            )
        )
    }

    private fun User.toResponse() = UserResponse(
        id.value,
        version,
        username,
        status
    )

}