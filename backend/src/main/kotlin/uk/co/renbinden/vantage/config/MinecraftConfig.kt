package uk.co.renbinden.vantage.config

data class MinecraftConfig(
    val command: String = "java -jar spigot-1.20.4.jar -nogui",
    val directory: String = "./minecraft-server"
)