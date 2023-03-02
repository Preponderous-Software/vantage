package uk.co.renbinden.vantage.endpoint.api.v2.user

import dev.forkhandles.result4k.onFailure
import dev.forkhandles.result4k.resultFrom
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.CONFLICT
import org.http4k.core.Status.Companion.CREATED
import org.http4k.core.Status.Companion.INTERNAL_SERVER_ERROR
import org.http4k.core.Status.Companion.NOT_FOUND
import org.http4k.core.Status.Companion.OK
import org.http4k.core.Status.Companion.UNAUTHORIZED
import org.http4k.core.with
import org.http4k.routing.path
import uk.co.renbinden.vantage.audit.AuditItem
import uk.co.renbinden.vantage.audit.AuditRepository
import uk.co.renbinden.vantage.auth.Authenticator
import uk.co.renbinden.vantage.auth.userId
import uk.co.renbinden.vantage.failure.OptimisticLockingFailureException
import uk.co.renbinden.vantage.user.User
import uk.co.renbinden.vantage.user.UserId
import uk.co.renbinden.vantage.user.UserRepository
import java.time.Instant

class UserHandler(
    private val authenticator: Authenticator,
    private val userRepository: UserRepository,
    private val auditRepository: AuditRepository,
    private val baseUrl: String
) {

    fun get(request: Request): Response {
        val id = request.path("id")?.let(::UserId) ?: return Response(NOT_FOUND)
        val user = userRepository.getUser(id) ?: return Response(NOT_FOUND)
        return Response(OK).with(
            UserResponse.lens of user.toResponse()
        )
    }

    fun post(request: Request): Response {
        val userCreateRequest = UserCreateRequest.lens(request)
        val upsertedUser = userRepository.upsert(User(
            userCreateRequest.username,
            userCreateRequest.password
        ))
        val userId = request.userId(authenticator) ?: return Response(UNAUTHORIZED)
        auditRepository.insert(
            AuditItem(
                userId,
                "Created user ${upsertedUser.username} (${upsertedUser.id.value})",
                Instant.now()
            )
        )
        return Response(CREATED)
            .header("Location", "$baseUrl/api/v2/user/${upsertedUser.id.value}")
            .with(UserResponse.lens of upsertedUser.toResponse())
    }

    fun patch(request: Request): Response {
        val id = request.path("id")?.let(::UserId) ?: return Response(NOT_FOUND)
        val userUpdateRequest = UserUpdateRequest.lens(request)
        val user = userRepository.getUser(id) ?: return Response(NOT_FOUND)
        val updatedUser = user.copy(
            version = userUpdateRequest.version,
            username = userUpdateRequest.username ?: user.username,
            status = userUpdateRequest.status ?: user.status
        ).let {
            if (userUpdateRequest.password != null) {
                it.withPassword(userUpdateRequest.password)
            } else {
                it
            }
        }
        val upsertedUser = resultFrom {
            userRepository.upsert(updatedUser)
        }.onFailure { failure ->
            if (failure.reason.cause is OptimisticLockingFailureException) {
                return Response(CONFLICT)
            } else {
                return Response(INTERNAL_SERVER_ERROR)
            }
        }
        val userId = request.userId(authenticator) ?: return Response(UNAUTHORIZED)
        auditRepository.insert(
            AuditItem(
                userId,
                "Updated user ${upsertedUser.username} (${upsertedUser.id.value})",
                Instant.now()
            )
        )
        return Response(OK)
            .with(UserResponse.lens of upsertedUser.toResponse())
    }

    private fun User.toResponse() = UserResponse(
        id.value,
        version,
        username,
        status
    )

}