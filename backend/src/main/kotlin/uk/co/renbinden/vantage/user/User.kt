package uk.co.renbinden.vantage.user

import java.security.SecureRandom
import java.util.*
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec

class User {

    val id: UserId
    val version: Int
    val username: String
    val passwordHash: ByteArray
    val passwordSalt: ByteArray
    val status: UserStatus

    constructor(id: UserId, version: Int, username: String, passwordHash: ByteArray, passwordSalt: ByteArray, status: UserStatus) {
        this.id = id
        this.version = version
        this.username = username
        this.passwordHash = passwordHash
        this.passwordSalt = passwordSalt
        this.status = status
    }

    constructor(username: String, password: String) {
        this.id = UserId.generate()
        this.version = 0
        this.username = username
        val random = SecureRandom()
        this.passwordSalt = ByteArray(16)
        random.nextBytes(passwordSalt)
        val spec = PBEKeySpec(password.toCharArray(), passwordSalt, 65536, 128)
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512")
        this.passwordHash = factory.generateSecret(spec).encoded
        this.status = UserStatus.ACTIVE
    }

    fun copy(
        id: UserId? = null,
        version: Int? = null,
        username: String? = null,
        passwordHash: ByteArray? = null,
        passwordSalt: ByteArray? = null,
        status: UserStatus? = null
    ) = User(
        id ?: this.id,
        version ?: this.version,
        username ?: this.username,
        passwordHash ?: this.passwordHash,
        passwordSalt ?: this.passwordSalt,
        status ?: this.status
    )

    fun withPassword(password: String): User {
        val random = SecureRandom()
        val passwordSalt = ByteArray(16)
        random.nextBytes(passwordSalt)
        val spec = PBEKeySpec(password.toCharArray(), passwordSalt, 65536, 128)
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512")
        val passwordHash = factory.generateSecret(spec).encoded
        return copy(
            passwordHash = passwordHash,
            passwordSalt = passwordSalt
        )
    }

    fun checkPassword(password: String): Boolean {
        val spec = PBEKeySpec(password.toCharArray(), passwordSalt, 65536, 128)
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512")
        return Arrays.equals(passwordHash, factory.generateSecret(spec).encoded)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as User

        if (id != other.id) return false
        if (version != other.version) return false
        if (username != other.username) return false
        if (!passwordHash.contentEquals(other.passwordHash)) return false
        if (!passwordSalt.contentEquals(other.passwordSalt)) return false
        if (status != other.status) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + version
        result = 31 * result + username.hashCode()
        result = 31 * result + passwordHash.contentHashCode()
        result = 31 * result + passwordSalt.contentHashCode()
        result = 31 * result + status.hashCode()
        return result
    }
}