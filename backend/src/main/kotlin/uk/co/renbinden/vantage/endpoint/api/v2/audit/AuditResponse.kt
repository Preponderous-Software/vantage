package uk.co.renbinden.vantage.endpoint.api.v2.audit

import org.http4k.core.Body
import org.http4k.format.Gson.auto
import uk.co.renbinden.vantage.endpoint.api.v2.PaginationResponse

data class AuditResponse(
    val items: List<AuditItemResponse>,
    val pagination: PaginationResponse
) {
    companion object {
        val lens = Body.auto<AuditResponse>().toLens()
    }
}