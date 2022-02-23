from fastapi import APIRouter
from fastapi.responses import FileResponse


from model.har_main import HAR
import tempfile


router = APIRouter()
#Ruta que mediante la función del programa principal devuelve la gráfica circular en forma de imagen "png".
@router.get("/graph/{id_file}", name="Return the graph obtained")
async def create_graph(id_file: str):
        data = HAR.preparaDatos(id_file)
        dataFinal = HAR.dataYprediccion(data, 'keras_model_fromMongo.h5')
        porcentaje = HAR.calculaPorcentaje((dataFinal['nameActivities']))
        graph = HAR.circulActividades(porcentaje)
        with tempfile.NamedTemporaryFile(mode="w+b", suffix=".png", delete=False) as FOUT:
                FOUT.write(graph)
        return FileResponse(FOUT.name, media_type="image/png")