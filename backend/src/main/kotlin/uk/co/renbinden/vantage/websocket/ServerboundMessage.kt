package uk.co.renbinden.vantage.websocket

import org.http4k.websocket.WsMessage
import uk.co.renbinden.vantage.websocket.MessageGson.auto

sealed class ServerboundMessage {
    companion object {
        val lens = WsMessage.auto<ServerboundMessage>().toLens()
    }
}
class CommandMessage(val command: String) : ServerboundMessage()
object StartMessage : ServerboundMessage()
object PingMessage : ServerboundMessage()