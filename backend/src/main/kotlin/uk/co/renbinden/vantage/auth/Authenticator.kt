package uk.co.renbinden.vantage.auth

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jws
import io.jsonwebtoken.Jwts
import uk.co.renbinden.vantage.user.UserRepository
import uk.co.renbinden.vantage.user.UserStatus.ACTIVE
import java.io.File
import java.nio.charset.StandardCharsets
import java.security.KeyFactory
import java.security.KeyPairGenerator
import java.security.interfaces.RSAPrivateKey
import java.security.spec.PKCS8EncodedKeySpec
import java.time.Duration
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

class Authenticator(val userRepository: UserRepository) {

    private val base64Decoder = Base64.getDecoder()
    private val privateKeyPemBegin = "-----BEGIN PRIVATE KEY-----"
    private val privateKeyPemEnd = "-----END PRIVATE KEY-----"
    private val keyFactory = KeyFactory.getInstance("RSA")

    private val key: RSAPrivateKey

    init {
        val privateKeyFile = File("./private.pem")
        if (!privateKeyFile.exists()) {
            val keyPairGenerator = KeyPairGenerator.getInstance("RSA")
            keyPairGenerator.initialize(2048)
            val keyPair = keyPairGenerator.generateKeyPair()
            privateKeyFile.writeText(
                privateKeyPemBegin + "\n" +
                        Base64.getEncoder().encodeToString(keyPair.private.encoded) + "\n" +
                        privateKeyPemEnd
            )
        }
        key = privateKeyFromPem(privateKeyFile.readText(StandardCharsets.UTF_8))
    }

    private fun privateKeyFromPem(pemfile: String): RSAPrivateKey {
        val bytes = base64Decoder.decode(
            pemfile
                .replace(privateKeyPemBegin, "")
                .replace(privateKeyPemEnd, "")
                .replace("\n", "")
        )
        return keyFactory.generatePrivate(PKCS8EncodedKeySpec(bytes)) as RSAPrivateKey
    }

    fun authenticate(username: String, password: String): String? {
        val user = userRepository.getUser(username) ?: return null
        if (user.status != ACTIVE) return null
        if (!user.checkPassword(password)) return null
        val jws = Jwts.builder()
            .setSubject(user.id.value)
            .setExpiration(Date.from(Instant.now().plus(Duration.of(24, ChronoUnit.HOURS))))
            .signWith(key)
            .compact()
        verify(jws)
        return jws
    }

    fun verify(jws: String): Jws<Claims> {
        val parser = Jwts.parserBuilder().setSigningKey(key).build()
        return parser.parseClaimsJws(jws)
    }

}