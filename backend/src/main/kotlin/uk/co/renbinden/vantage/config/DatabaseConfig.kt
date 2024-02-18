package uk.co.renbinden.vantage.config

data class DatabaseConfig(
    val url: String = "jdbc:postgresql://backend-vantagedb-1/vantage",
    val username: String? = "vantage",
    val password: String? = "vantage",
    val dialect: String = "POSTGRES"
)