package uk.co.renbinden.vantage.auth

import org.http4k.core.Filter
import org.http4k.core.HttpHandler
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.UNAUTHORIZED
import uk.co.renbinden.vantage.user.UserId
import uk.co.renbinden.vantage.user.UserRepository
import uk.co.renbinden.vantage.user.UserStatus.ACTIVE
import java.util.*

class Authenticated(private val authenticator: Authenticator, val userRepository: UserRepository) : Filter {

    override fun invoke(next: HttpHandler): HttpHandler {
        return { request -> handle(next, request) }
    }

    fun handle(next: HttpHandler, request: Request): Response {
        try {
            val authorizationHeader = request.header("Authorization") ?: return Response(UNAUTHORIZED)
            if (!authorizationHeader.startsWith("Bearer ")) return Response(UNAUTHORIZED)
            val token = authorizationHeader.replaceFirst("Bearer ", "")
            val jws = authenticator.verify(token)
            val userId = UserId(UUID.fromString(jws.body.subject).toString())
            val user = userRepository.getUser(userId) ?: return Response(UNAUTHORIZED)
            if (user.status != ACTIVE) {
                return Response(UNAUTHORIZED)
            }
        } catch (exception: Exception) {
            return Response(UNAUTHORIZED)
        }
        return next(request)
    }

}