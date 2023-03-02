package uk.co.renbinden.vantage.audit

import uk.co.renbinden.vantage.user.UserId
import java.time.Instant

data class AuditItem(
    val userId: UserId,
    val description: String,
    val time: Instant
)