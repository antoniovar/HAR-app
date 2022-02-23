from fastapi import APIRouter
from fastapi.datastructures import UploadFile
from fastapi import File


from model.insertDataGRIDFS import MongoDB

router = APIRouter()
#Ruta para subir a mongodb los datos que proporciona el usuario.
@router.post("/data/{user_id}", name="Insert de data in mongodb")
async def insertData(user_id: str, file: UploadFile=File(...)):
        orig = await file.read()    
        db = MongoDB.mongo_conn()
        MongoDB.insertData(db,orig, user_id)
        
        