package uk.co.renbinden.vantage.endpoint.api.v2.server

import org.http4k.core.Body
import org.http4k.format.Gson.auto

data class ServerLogResponse(
    val log: List<String>
) {
    companion object {
        val lens = Body.auto<ServerLogResponse>().toLens()
    }
}