package uk.co.renbinden.vantage.websocket

import org.http4k.websocket.WsMessage
import uk.co.renbinden.vantage.websocket.MessageGson.auto

sealed class ClientboundMessage {
    companion object {
        val lens = WsMessage.auto<ClientboundMessage>().toLens()
    }
}

object PongMessage : ClientboundMessage()
class LogMessage(val text: String) : ClientboundMessage()
class ServerStatusMessage(val isRunning: Boolean) : ClientboundMessage()
