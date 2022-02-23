from fastapi import APIRouter
from fastapi.responses import FileResponse
from pymongo import MongoClient
import pymongo, gridfs
from gridfs import GridFS
from bson.objectid import ObjectId

from model.har_main import HAR
import tempfile


router = APIRouter()
#Ruta que mediante la función del programa principal devuelve la gráfica circular en forma de imagen "png".
@router.get("/data/{id_user}", name="Return a list with csvs uploaded")
async def devData(id_user: str):
    client = MongoClient("localhost", 27017)
    db = client["grid_file"]
    collection = db["fs.files"]                
    fs = gridfs.GridFS(db)
    
    
    db.fs.chunks.find( { 'filename' : 'csv' } )
    
    
    
    
    
    
    
    
    
    
    
    
    
    fout = []
    fout.append(gout.read())
    
    
    fout2 = str(fout[0])
    
    fout3= fout2.split("\\r\\n")
    
    
    ListaUlt = []
    
    for i in range(len(fout3)-1):
        ListaUlt.append(fout3[i+1].split(','))
    
    
    df = pd.DataFrame(ListaUlt, columns =['userID', 'activity', 'timestamp', 'x-axis', 'y-axis', 'z-axis'])