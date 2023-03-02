package uk.co.renbinden.vantage.endpoint.api.v2.brand

import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK
import org.http4k.core.with
import uk.co.renbinden.vantage.config.ServerConfig

class BrandHandler(private val serverConfig: ServerConfig) {

    fun get(request: Request): Response {
        return Response(OK).with(
            BrandResponse.lens of BrandResponse(
                serverConfig.name
            )
        )
    }

}