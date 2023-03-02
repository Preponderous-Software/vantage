package uk.co.renbinden.vantage.config

data class Config(
    val server: ServerConfig = ServerConfig(),
    val database: DatabaseConfig = DatabaseConfig(),
    val minecraft: MinecraftConfig = MinecraftConfig()
)