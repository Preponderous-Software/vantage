package uk.co.renbinden.vantage.endpoint.api.v2.server

import org.http4k.core.Body
import org.http4k.format.Gson.auto

data class ServerResponse(
    val isRunning: Boolean
) {
    companion object {
        val lens = Body.auto<ServerResponse>().toLens()
    }
}