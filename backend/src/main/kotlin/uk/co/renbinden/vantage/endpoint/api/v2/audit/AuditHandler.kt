package uk.co.renbinden.vantage.endpoint.api.v2.audit

import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK
import org.http4k.core.with
import org.http4k.routing.path
import uk.co.renbinden.vantage.audit.AuditItem
import uk.co.renbinden.vantage.audit.AuditRepository
import uk.co.renbinden.vantage.endpoint.api.v2.PaginationResponse
import uk.co.renbinden.vantage.endpoint.api.v2.user.UserResponse
import uk.co.renbinden.vantage.user.User
import uk.co.renbinden.vantage.user.UserRepository

class AuditHandler(private val auditRepository: AuditRepository, private val userRepository: UserRepository) {

    fun get(request: Request): Response {
        val page = request.path("page")?.toIntOrNull() ?: 0
        return Response(OK)
            .with(
                AuditResponse.lens of AuditResponse(
                    auditRepository.getAuditRecords(50, page * 50).map { it.toResponse() },
                    PaginationResponse(auditRepository.getCount())
                )
            )
    }

    private fun AuditItem.toResponse() = AuditItemResponse(
        userRepository.getUser(userId).let(::requireNotNull).toResponse(),
        description,
        time
    )

    private fun User.toResponse() = UserResponse(
        id.value,
        version,
        username,
        status
    )

}