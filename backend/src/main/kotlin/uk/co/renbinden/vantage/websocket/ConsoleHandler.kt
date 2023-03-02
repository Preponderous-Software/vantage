package uk.co.renbinden.vantage.websocket

import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.UnsupportedJwtException
import io.jsonwebtoken.security.SecurityException
import org.http4k.websocket.Websocket
import org.http4k.websocket.WsStatus.Companion.POLICY_VALIDATION
import org.slf4j.LoggerFactory
import uk.co.renbinden.vantage.audit.AuditItem
import uk.co.renbinden.vantage.audit.AuditRepository
import uk.co.renbinden.vantage.auth.Authenticator
import uk.co.renbinden.vantage.minecraft.MinecraftServer
import uk.co.renbinden.vantage.user.UserId
import uk.co.renbinden.vantage.user.UserRepository
import java.time.Instant
import java.util.*
import kotlin.concurrent.thread

class ConsoleHandler(
    private val authenticator: Authenticator,
    private val userRepository: UserRepository,
    private val auditRepository: AuditRepository,
    private val minecraftServer: MinecraftServer,
) {

    private val logger = LoggerFactory.getLogger(javaClass)

    fun onSocketOpen(websocket: Websocket) {
        val token = websocket.upgradeRequest.query("token")
        if (token == null) {
            websocket.close(POLICY_VALIDATION.description("token parameter must be specified"))
            return
        }
        val jws = try {
            authenticator.verify(token)
        } catch (exception: UnsupportedJwtException) {
            websocket.close(POLICY_VALIDATION.description("invalid token format"))
            return
        } catch (exception: MalformedJwtException) {
            websocket.close(POLICY_VALIDATION.description("invalid token"))
            return
        } catch (exception: SecurityException) {
            websocket.close(POLICY_VALIDATION.description("signature validation failed"))
            return
        } catch (exception: ExpiredJwtException) {
            websocket.close(POLICY_VALIDATION.description("expired token"))
            return
        } catch (exception: IllegalArgumentException) {
            websocket.close(POLICY_VALIDATION.description("empty token"))
            return
        }
        val userId = UserId(UUID.fromString(jws.body.subject).toString())
        val user = userRepository.getUser(userId)
        if (user == null) {
            websocket.close(POLICY_VALIDATION)
            return
        }

        minecraftServer.consoleSockets.add(websocket)

        websocket.onMessage { message ->
            when (val action = ServerboundMessage.lens(message)) {
                is CommandMessage -> {
                    if (minecraftServer.isRunning) {
                        val process = minecraftServer.process
                        if (process != null) {
                            val outputStream = process.outputStream
                            if (outputStream != null) {
                                logger.info("${user.username} executed command \"${action.command}\"")
                                outputStream.write("${action.command}\n".toByteArray())
                                outputStream.flush()
                                auditRepository.insert(
                                    AuditItem(
                                        userId,
                                        "Executed command \"${action.command}\"",
                                        Instant.now()
                                    )
                                )
                            }
                        }
                    }
                }
                is StartMessage -> {
                    if (!minecraftServer.isRunning) {
                        logger.info("${user.username} started the server")
                        auditRepository.insert(
                            AuditItem(
                                userId,
                                "Started the server",
                                Instant.now()
                            )
                        )
                        thread {
                            minecraftServer.start()
                        }
                    }
                }
                is PingMessage -> {
                    websocket.send(ClientboundMessage.lens(PongMessage))
                }
            }
        }

        websocket.onClose {
            minecraftServer.consoleSockets.remove(websocket)
        }
    }

}