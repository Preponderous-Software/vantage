package uk.co.renbinden.vantage.endpoint.api.v2.files

import org.http4k.core.Body
import org.http4k.format.Gson.auto

data class FilesResponse(
    val files: List<FileResponse>
) {
    companion object {
        val lens = Body.auto<FilesResponse>().toLens()
    }
}