package uk.co.renbinden.vantage.endpoint.api.v2.server

import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK
import org.http4k.core.with
import uk.co.renbinden.vantage.minecraft.MinecraftServer

class ServerHandler(private val minecraftServer: MinecraftServer) {

    fun get(request: Request): Response {
        return Response(OK)
            .with(
                ServerResponse.lens of ServerResponse(
                    minecraftServer.isRunning
                )
            )
    }
}