package uk.co.renbinden.vantage.endpoint.api.v2.audit

import org.http4k.core.Body
import org.http4k.format.Gson.auto
import uk.co.renbinden.vantage.endpoint.api.v2.user.UserResponse
import java.time.Instant

data class AuditItemResponse(
    val user: UserResponse,
    val description: String,
    val time: Instant
) {
    companion object {
        val lens = Body.auto<AuditItemResponse>().toLens()
    }
}