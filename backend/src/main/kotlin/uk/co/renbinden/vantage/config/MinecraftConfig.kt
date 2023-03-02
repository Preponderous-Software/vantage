package uk.co.renbinden.vantage.config

data class MinecraftConfig(
    val command: String = "java -jar spigot-1.19.2.jar -nogui",
    val directory: String = "./minecraft-server"
)