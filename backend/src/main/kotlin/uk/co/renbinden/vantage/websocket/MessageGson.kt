package uk.co.renbinden.vantage.websocket

import com.google.gson.GsonBuilder
import com.google.gson.JsonSyntaxException
import com.google.gson.TypeAdapter
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonWriter
import org.http4k.format.ConfigurableGson
import org.http4k.format.asConfigurable
import org.http4k.format.withStandardMappings

object MessageGson : ConfigurableGson(
    GsonBuilder()
        .serializeNulls()
        .registerTypeHierarchyAdapter(
            ServerboundMessage::class.java,
            ServerboundMessageAdapter()
        )
        .registerTypeHierarchyAdapter(
            ClientboundMessage::class.java,
            ClientboundMessageAdapter()
        )
        .asConfigurable()
        .withStandardMappings()
        .done()
)

class ServerboundMessageAdapter : TypeAdapter<ServerboundMessage>() {
    override fun write(out: JsonWriter, value: ServerboundMessage) {
        out.beginObject()
        out.name("type").value(when (value) {
            is CommandMessage -> "command"
            is StartMessage -> "start"
            is PingMessage -> "ping"
        })
        if (value is CommandMessage) {
            out.name("command").value(value.command)
        }
        out.endObject()
    }

    override fun read(`in`: JsonReader): ServerboundMessage {
        val properties = mutableMapOf<String, String>()
        `in`.beginObject()
        while (`in`.hasNext()) {
            when (`in`.nextName()) {
                "type" -> properties["type"] = `in`.nextString()
                "command" -> properties["command"] = `in`.nextString()
            }
        }
        `in`.endObject()
        return when (properties["type"]) {
            "command" -> CommandMessage(properties["command"]!!)
            "start" -> StartMessage
            "ping" -> PingMessage
            else -> throw JsonSyntaxException("Invalid action type")
        }
    }

}

class ClientboundMessageAdapter : TypeAdapter<ClientboundMessage>() {
    override fun write(out: JsonWriter, value: ClientboundMessage) {
        out.beginObject()
        out.name("type").value(when (value) {
            is PongMessage -> "pong"
            is LogMessage -> "log"
            is ServerStatusMessage -> "status"
        })
        if (value is LogMessage) {
            out.name("text").value(value.text)
        }
        out.endObject()
    }

    override fun read(`in`: JsonReader): ClientboundMessage {
        val properties = mutableMapOf<String, Any>()
        `in`.beginObject()
        while (`in`.hasNext()) {
            when (`in`.nextName()) {
                "type" -> properties["type"] = `in`.nextString()
                "text" -> properties["text"] = `in`.nextString()
                "isRunning" -> properties["isRunning"] = `in`.nextBoolean()
            }
        }
        `in`.endObject()
        return when (properties["type"]) {
            "pong" -> PongMessage
            "log" -> LogMessage(properties["text"] as String)
            "status" -> ServerStatusMessage(properties["isRunning"] as Boolean)
            else -> throw JsonSyntaxException("Invalid action type")
        }
    }

}