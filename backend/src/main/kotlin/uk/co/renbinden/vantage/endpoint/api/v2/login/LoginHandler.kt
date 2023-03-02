package uk.co.renbinden.vantage.endpoint.api.v2.login

import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK
import org.http4k.core.Status.Companion.UNAUTHORIZED
import org.http4k.core.with
import uk.co.renbinden.vantage.audit.AuditItem
import uk.co.renbinden.vantage.audit.AuditRepository
import uk.co.renbinden.vantage.auth.Authenticator
import uk.co.renbinden.vantage.user.UserId
import uk.co.renbinden.vantage.user.UserRepository
import uk.co.renbinden.vantage.user.UserStatus.INACTIVE
import java.time.Instant
import java.util.*

class LoginHandler(
    private val authenticator: Authenticator,
    private val userRepository: UserRepository,
    private val auditRepository: AuditRepository
) {

    fun post(request: Request): Response {
        val loginRequest = LoginRequest.lens(request)
        val jwt = authenticator.authenticate(loginRequest.username, loginRequest.password)
            ?: return Response(UNAUTHORIZED)
        val jws  = authenticator.verify(jwt)
        val userId = UserId(UUID.fromString(jws.body.subject).toString())
        val user = userRepository.getUser(userId) ?: return Response(UNAUTHORIZED)
        if (user.status == INACTIVE) return Response(UNAUTHORIZED)
        auditRepository.insert(
            AuditItem(
                userId,
                "Logged in",
                Instant.now()
            )
        )
        return Response(OK).with(
            LoginResponse.lens of LoginResponse(
                token = jwt,
                userId = user.id,
                username = user.username
            )
        )
    }

}