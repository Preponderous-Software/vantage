package uk.co.renbinden.vantage.config

data class DatabaseConfig(
    val url: String = "jdbc:postgresql://localhost/vantage",
    val username: String? = null,
    val password: String? = null,
    val dialect: String = "POSTGRES"
)