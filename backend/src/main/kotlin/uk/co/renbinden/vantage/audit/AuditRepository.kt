package uk.co.renbinden.vantage.audit

import org.jooq.DSLContext
import uk.co.renbinden.vantage.jooq.Tables.AUDIT_LOG
import uk.co.renbinden.vantage.jooq.tables.records.AuditLogRecord
import uk.co.renbinden.vantage.user.UserId
import java.time.ZoneOffset.UTC

class AuditRepository(private val dsl: DSLContext) {

    fun getAuditRecords(amount: Int = 50, offset: Int = 0) =
        dsl.selectFrom(AUDIT_LOG)
            .orderBy(AUDIT_LOG.TIME.desc())
            .offset(offset)
            .limit(amount)
            .fetch()
            .map { it.toDomain() }

    fun getCount() =
        dsl.selectCount().from(AUDIT_LOG)
            .fetchOne()
            ?.value1() ?: 0

    fun insert(item: AuditItem): AuditItem {
        val insertedItem = dsl.insertInto(AUDIT_LOG)
            .set(AUDIT_LOG.USER_ID, item.userId.value)
            .set(AUDIT_LOG.DESCRIPTION, item.description)
            .set(AUDIT_LOG.TIME, item.time.atOffset(UTC))
            .returning()
            .fetchOne()
            .let(::requireNotNull)
        return insertedItem.toDomain()
    }

    fun AuditLogRecord.toDomain() = AuditItem(
        userId.let(::UserId),
        description,
        time.toInstant()
    )

}