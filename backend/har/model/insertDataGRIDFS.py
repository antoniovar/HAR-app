from pymongo import MongoClient
import gridfs


class MongoDB(object):
    def mongo_conn():
        try:
            conn = MongoClient("localhost", 27017)
            return conn.grid_file
        except Exception as e:
            print("Error in database connection", e)

    def insertData(connection, path, user_id):
        fs = gridfs.GridFS(connection)
        fs.put(path, filename="csv", userID=user_id)
        print("upload complete")








   
