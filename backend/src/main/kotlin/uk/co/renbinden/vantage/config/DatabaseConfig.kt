package uk.co.renbinden.vantage.config

data class DatabaseConfig(
    val url: String = "jdbc:postgresql://vantage_vantagedb_1/vantage",
    val username: String? = "vantage",
    val password: String? = "vantage",
    val dialect: String = "POSTGRES"
)