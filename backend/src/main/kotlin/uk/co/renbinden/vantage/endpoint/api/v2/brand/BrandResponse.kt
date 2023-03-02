package uk.co.renbinden.vantage.endpoint.api.v2.brand

import org.http4k.core.Body
import org.http4k.format.Gson.auto

data class BrandResponse(
    val serverName: String
) {
    companion object {
        val lens = Body.auto<BrandResponse>().toLens()
    }
}