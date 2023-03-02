package uk.co.renbinden.vantage.minecraft

import org.http4k.websocket.Websocket
import org.slf4j.LoggerFactory
import uk.co.renbinden.vantage.config.MinecraftConfig
import uk.co.renbinden.vantage.websocket.ClientboundMessage
import uk.co.renbinden.vantage.websocket.LogMessage
import uk.co.renbinden.vantage.websocket.ServerStatusMessage
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.util.concurrent.CopyOnWriteArrayList
import kotlin.concurrent.thread

class MinecraftServer(
    private val config: MinecraftConfig
) {

    var process: Process? = null
    var isRunning = false
    val consoleLog = CopyOnWriteArrayList<String>()
    val consoleSockets = CopyOnWriteArrayList<Websocket>()
    private val logger = LoggerFactory.getLogger(javaClass)

    fun start() {
        val directory = File(config.directory)
        if (directory.exists() && !directory.isDirectory) {
            throw Exception("Please remove the file at ${directory.canonicalPath}")
        }
        if (!directory.exists()) {
            directory.mkdirs()
        }
        val process = ProcessBuilder()
            .command(config.command.split(Regex("\\s+")))
            .directory(File(config.directory))
            .start()
        this.process = process
        isRunning = true
        val currentConsoleSocketsStartup = ArrayList(consoleSockets)
        currentConsoleSocketsStartup.forEach { socket ->
            socket.send(ClientboundMessage.lens(ServerStatusMessage(isRunning)))
        }
        logger.info("Minecraft server started.")

        thread {
            val reader = BufferedReader(InputStreamReader(process.inputStream))
            var line: String? = ""
            while (line != null) {
                line = reader.readLine()
                if (line != null) {
                    consoleLog.add(line)
                    val currentConsoleSocketsLog = ArrayList(consoleSockets)
                    currentConsoleSocketsLog.forEach { socket ->
                        socket.send(ClientboundMessage.lens(LogMessage(line)))
                    }
                    logger.info(line)
                }
            }
            reader.close()
        }

        val exitCode = process.waitFor()
        isRunning = false
        val currentConsoleSocketsShutdown = ArrayList(consoleSockets)
        currentConsoleSocketsShutdown.forEach { socket ->
            socket.send(ClientboundMessage.lens(ServerStatusMessage(isRunning)))
        }
        logger.info("Minecraft server exited with code ${exitCode}.")
    }

}