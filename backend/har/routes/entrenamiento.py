from fastapi import APIRouter
from model.har_main import HAR


router = APIRouter()
#Ruta para la función de entrenamiento del modelo.
@router.get("/train/{id_file}", name="Return the graph obtained")
async def create_graph(id_file: str):
        data = HAR.preparaDatos(id_file)
        idModelo = HAR.entrenarModelo(data)
        HAR.modelFromMongo(idModelo)

        
