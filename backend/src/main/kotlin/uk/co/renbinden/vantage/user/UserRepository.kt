package uk.co.renbinden.vantage.user

import org.jooq.DSLContext
import uk.co.renbinden.vantage.failure.OptimisticLockingFailureException
import uk.co.renbinden.vantage.jooq.Tables.PANEL_USER
import uk.co.renbinden.vantage.jooq.tables.records.PanelUserRecord

class UserRepository(val dsl: DSLContext) {
    fun getUser(id: UserId) =
        dsl.selectFrom(PANEL_USER)
            .where(PANEL_USER.ID.eq(id.value))
            .fetchOne()
            ?.toDomain()

    fun getUser(username: String) =
        dsl.selectFrom(PANEL_USER)
            .where(PANEL_USER.USERNAME.eq(username))
            .fetchOne()
            ?.toDomain()

    fun getUsers(amount: Int = 50, offset: Int = 0) =
        dsl.selectFrom(PANEL_USER)
            .orderBy(PANEL_USER.USERNAME)
            .offset(offset)
            .limit(amount)
            .fetch()
            .map { it.toDomain() }

    fun getUserCount() =
        dsl.selectCount()
            .from(PANEL_USER)
            .fetchOne()
            ?.value1() ?: 0

    fun upsert(user: User): User {
        val upsertedUser = dsl.insertInto(PANEL_USER)
            .set(PANEL_USER.ID, user.id.value)
            .set(PANEL_USER.VERSION, 1)
            .set(PANEL_USER.USERNAME, user.username)
            .set(PANEL_USER.PASSWORD_HASH, user.passwordHash)
            .set(PANEL_USER.PASSWORD_SALT, user.passwordSalt)
            .set(PANEL_USER.STATUS, user.status.name)
            .onConflict(PANEL_USER.ID).doUpdate()
            .set(PANEL_USER.USERNAME, user.username)
            .set(PANEL_USER.PASSWORD_HASH, user.passwordHash)
            .set(PANEL_USER.PASSWORD_SALT, user.passwordSalt)
            .set(PANEL_USER.STATUS, user.status.name)
            .set(PANEL_USER.VERSION, user.version + 1)
            .where(PANEL_USER.ID.eq(user.id.value))
            .and(PANEL_USER.VERSION.eq(user.version))
            .returning()
            .fetchOne() ?: throw OptimisticLockingFailureException("Invalid version: ${user.version}")
        return upsertedUser.toDomain()
    }

    private fun PanelUserRecord.toDomain() = User(
        id.let(::UserId),
        version,
        username,
        passwordHash,
        passwordSalt,
        status.let(UserStatus::valueOf)
    )
}