import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from routes.har import router as har_router
from routes.harCircular import router as harC_router
from routes.harHistograma import router as dataH_router
from routes.insert_data_gridfs import router as dataG_router
from routes.entrenamiento import router as entrenamiento_router

app = FastAPI(title="HAR")


# cors

origins = ["*"]

app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)


# routes
app.include_router(har_router, prefix="/showGraph")

app.include_router(harC_router, prefix="/showGraphCircular")

app.include_router(dataH_router, prefix="/showGraphHistogram")

app.include_router(entrenamiento_router, prefix="/trainData")


app.include_router(dataG_router, prefix="/insertDataG")




