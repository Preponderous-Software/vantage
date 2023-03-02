package uk.co.renbinden.vantage.config

data class ServerConfig(
    val name: String = "Server",
    val port: Int = 9000,
    val baseUrl: String = "",
    val allowedOrigins: List<String> = listOf("http://localhost:3000")
)