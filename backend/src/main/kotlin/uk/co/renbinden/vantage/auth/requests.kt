package uk.co.renbinden.vantage.auth

import org.http4k.core.Request
import uk.co.renbinden.vantage.user.UserId
import java.util.*

fun Request.userId(authenticator: Authenticator): UserId? {
    val authorizationHeader = header("Authorization") ?: return null
    if (!authorizationHeader.startsWith("Bearer ")) return null
    val token = authorizationHeader.replaceFirst("Bearer ", "")
    val jws = authenticator.verify(token)
    return UserId(UUID.fromString(jws.body.subject).toString())
}
