from fastapi import APIRouter
from fastapi.responses import HTMLResponse
import plotly.express as px
from model.har_main import HAR

router = APIRouter()
#Ruta que mediante la función del programa principal devuelve la gráfica temporal.
@router.get("/graph/{id_file}", name="Return the graph obtained")
async def create_graph(id_file: str):
        data = HAR.preparaDatos(id_file)
        dataFinal = HAR.dataYprediccion(data, 'keras_model_fromMongo.h5')
        fig = px.scatter(dataFinal, x=dataFinal['dateTimes'], y=dataFinal['nameActivities'])
        ht=fig.to_html()
        
        return HTMLResponse(ht)
    
    
    
    



