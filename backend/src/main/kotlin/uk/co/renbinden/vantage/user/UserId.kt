package uk.co.renbinden.vantage.user

import java.util.*

@JvmInline
value class UserId(val value: String) {
    companion object {
        fun generate() = UserId(UUID.randomUUID().toString())
    }
}