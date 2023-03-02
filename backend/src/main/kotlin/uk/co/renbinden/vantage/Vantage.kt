package uk.co.renbinden.vantage

import com.google.gson.GsonBuilder
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.flywaydb.core.Flyway
import org.http4k.core.Method.DELETE
import org.http4k.core.Method.GET
import org.http4k.core.Method.PATCH
import org.http4k.core.Method.POST
import org.http4k.core.Method.PUT
import org.http4k.core.then
import org.http4k.filter.AnyOf
import org.http4k.filter.CorsPolicy
import org.http4k.filter.OriginPolicy
import org.http4k.filter.ServerFilters.Cors
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.routing.websockets
import org.http4k.server.Jetty
import org.http4k.server.PolyHandler
import org.http4k.server.asServer
import org.jooq.SQLDialect
import org.jooq.conf.Settings
import org.jooq.impl.DSL
import uk.co.renbinden.vantage.audit.AuditRepository
import uk.co.renbinden.vantage.auth.Authenticated
import uk.co.renbinden.vantage.auth.Authenticator
import uk.co.renbinden.vantage.config.Config
import uk.co.renbinden.vantage.config.InvalidConfigException
import uk.co.renbinden.vantage.endpoint.api.v2.audit.AuditHandler
import uk.co.renbinden.vantage.endpoint.api.v2.brand.BrandHandler
import uk.co.renbinden.vantage.endpoint.api.v2.files.FilesHandler
import uk.co.renbinden.vantage.endpoint.api.v2.login.LoginHandler
import uk.co.renbinden.vantage.endpoint.api.v2.server.ServerHandler
import uk.co.renbinden.vantage.endpoint.api.v2.server.ServerLogHandler
import uk.co.renbinden.vantage.endpoint.api.v2.user.UserHandler
import uk.co.renbinden.vantage.endpoint.api.v2.users.UsersHandler
import uk.co.renbinden.vantage.minecraft.MinecraftServer
import uk.co.renbinden.vantage.user.User
import uk.co.renbinden.vantage.user.UserRepository
import uk.co.renbinden.vantage.websocket.ConsoleHandler
import java.io.File
import kotlin.concurrent.thread

fun main() {
    val gson = GsonBuilder().setPrettyPrinting().create()
    val configFile = File("./config.json")
    if (configFile.isDirectory) {
        throw InvalidConfigException("Config file exists, but is a directory. Please remove the directory named 'config.json'.")
    }
    if (!configFile.exists()) {
        configFile.writeText(gson.toJson(Config()))
    }
    val config = try {
        gson.fromJson(configFile.reader(Charsets.UTF_8), Config::class.java)
    } catch (exception: Exception) {
        throw InvalidConfigException("Failed to parse config file", exception)
    }

    val hikariConfig = HikariConfig()
    hikariConfig.jdbcUrl = config.database.url
    if (config.database.username != null) {
        hikariConfig.username = config.database.username
    }
    if (config.database.password != null) {
        hikariConfig.password = config.database.password
    }
    val dataSource = HikariDataSource(hikariConfig)
    val flyway = Flyway.configure()
        .dataSource(dataSource)
        .locations("classpath:uk/co/renbinden/vantage/db/migration")
        .table("vantage_schema_history")
        .baselineOnMigrate(true)
        .baselineVersion("0")
        .validateOnMigrate(false)
        .load()
    flyway.migrate()

    System.setProperty("org.jooq.no-logo", "true")
    System.setProperty("org.jooq.no-tips", "true")

    val dialect = SQLDialect.valueOf(config.database.dialect)
    val jooqSettings = Settings().withRenderSchema(false)
    val dsl = DSL.using(
        dataSource,
        dialect,
        jooqSettings
    )

    val userRepository = UserRepository(dsl)
    val auditRepository = AuditRepository(dsl)

    if (userRepository.getUserCount() == 0) {
        val charPool = ('a'..'z') + ('A'..'Z') + ('0'..'9')
        val password = (1..20).map { charPool.random() }.joinToString("")
        userRepository.upsert(User(
            "admin",
            password
        ))
        File("./.admin_password").writeText(password)
    }

    val authenticator = Authenticator(userRepository)

    val minecraftServer = MinecraftServer(config.minecraft)
    val minecraftServerThread = thread {
        minecraftServer.start()
    }
    Runtime.getRuntime().addShutdownHook(thread(false) {
        if (minecraftServer.isRunning) {
            minecraftServer.process?.outputStream?.write("stop\n".toByteArray())
            minecraftServerThread.join()
        }
    })

    val userHandler = UserHandler(authenticator, userRepository, auditRepository, config.server.baseUrl)
    val usersHandler = UsersHandler(userRepository)
    val loginHandler = LoginHandler(authenticator, userRepository, auditRepository)
    val serverHandler = ServerHandler(minecraftServer)
    val serverLogHandler = ServerLogHandler(minecraftServer)
    val auditHandler = AuditHandler(auditRepository, userRepository)
    val filesHandler = FilesHandler(File(config.minecraft.directory))
    val brandHandler = BrandHandler(config.server)
    val consoleHandler = ConsoleHandler(
        authenticator,
        userRepository,
        auditRepository,
        minecraftServer
    )

    val app = PolyHandler(
        Cors(
            policy = CorsPolicy(
                originPolicy = OriginPolicy.AnyOf(config.server.allowedOrigins),
                headers = listOf("Content-Type", "Authorization"),
                methods = listOf(GET, POST, PATCH, PUT, DELETE),
                credentials = true
            )
        ).then(
            routes(
                "/api" bind routes(
                    "/v2" bind routes(
                        "/user" bind routes(
                            "/{id}" bind GET to Authenticated(authenticator, userRepository).then(userHandler::get),
                            "/" bind POST to Authenticated(authenticator, userRepository).then(userHandler::post),
                            "/{id}" bind PATCH to Authenticated(authenticator, userRepository).then(userHandler::patch)
                        ),
                        "/users" bind GET to Authenticated(authenticator, userRepository).then(usersHandler::get),
                        "/login" bind POST to loginHandler::post,
                        "/server" bind GET to Authenticated(authenticator, userRepository).then(serverHandler::get),
                        "/server/log" bind GET to Authenticated(authenticator, userRepository).then(serverLogHandler::get),
                        "/audit" bind routes(
                            "/{page}" bind GET to Authenticated(authenticator, userRepository).then(auditHandler::get)
                        ),
                        "/files" bind routes(
                            "/" bind GET to Authenticated(authenticator, userRepository).then(filesHandler::get),
                            "/{path}" bind GET to Authenticated(authenticator, userRepository).then(filesHandler::get),
                            "/" bind PUT to Authenticated(authenticator, userRepository).then(filesHandler::put),
                            "/{path}" bind PUT to Authenticated(authenticator, userRepository).then(filesHandler::put),
                            "/{path}" bind DELETE to Authenticated(authenticator, userRepository).then(filesHandler::delete)
                        ),
                        "/brand" bind GET to Authenticated(authenticator, userRepository).then(brandHandler::get)
                    )
                )
            )
        ),
        websockets(
            "/ws/log" bind consoleHandler::onSocketOpen
        )
    )

    app.asServer(Jetty(config.server.port)).start()
}