from __future__ import print_function
import numpy as np
import pandas as pd
from pymongo import MongoClient
from matplotlib import pyplot as plt
from scipy import stats
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Conv2D
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from tensorflow.keras.layers import Flatten, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from bson.objectid import ObjectId
from PIL import Image
import io
import pymongo, gridfs
from gridfs import GridFS
from pylab import rcParams

class HAR():
    
    #Función que nos devuelve el conjunto de datos en forma de dataframe para trabajar con él
    def preparaDatos(id):
        #Función para convertir en float los ejes.
        def convert_to_float(x):
            try:
                return np.float(x)
            except:
                return np.nan
        
        #Importamos los datos desde mongodb       
        client = MongoClient("localhost", 27017)
        db = client["grid_file"]
        collection = db["fs.files"]                
        fs = gridfs.GridFS(db)
        
        gout = fs.get(ObjectId(id))
        
        
        fout = []
        fout.append(gout.read())
        
        
        fout2 = str(fout[0])
        
        fout3= fout2.split("\\r\\n")
        
        
        ListaUlt = []
        
        for i in range(len(fout3)-1):
            ListaUlt.append(fout3[i+1].split(','))
        
        
        df = pd.DataFrame(ListaUlt, columns =['userID', 'activity', 'timestamp', 'x-axis', 'y-axis', 'z-axis'])
        
       
        
        #Quitamos el caracter ";" de la columna del eje z
        df['z-axis'].replace(regex=True, inplace=True,to_replace=r';',value=r'')
        #Convertimos las columnas de los ejes en float
        df['x-axis'] = df['x-axis'].apply(convert_to_float)
        df['y-axis'] = df['y-axis'].apply(convert_to_float)
        df['z-axis'] = df['z-axis'].apply(convert_to_float)
        #Y la de timestamp también a float
        df['timestamp'] = df['timestamp'].apply(convert_to_float)
        
        #Eliminamos los na por si hay alguno
        df.dropna(axis=0, how='any', inplace=True)
        
        #Definimos las variables que nos servirán durante el desarrollo del programa.
        LABELS = ['Downstairs','Jogging','Sitting','Standing','Upstairs','Walking']
        #El número de pasos dentro de un segmento de tiempo
        TIME_PERIODS = 80
        # Los pasos a seguir de un segmento al siguiente; si este valor es igual a
        # TIME_PERIODS, entonces no hay OVERLAP entre los segmentos
        STEP_DISTANCE = 40
        
        
        '''
        A CONTINUACIÓN VAMOS A ASIGNARLE A CADA ACTIVIDAD UN VALOR NUMÉRICO EN UNA NUEVA COLUMNA. 
        ESTOS SON:
            0 == Downstairs
            1 == Jogging
            2 == Sitting
            3 == standing
            4 == Upstairs
            5 == Walking
        '''
        
        label = LabelEncoder()
        df['label'] = label.fit_transform(df['activity'])
        
        
        return(df)
        
    #Función para entrenar el modelo mediante la aplicación.
    def entrenarModelo(df):   
        '''
        DIVISIÓN DE LOS DATOS EN TRAIN Y TEST Y NORMALIZACIÓN DE LOS DATOS.
        CREACIÓN DE LAS SECUENCIAS
        '''
        X = df[['x-axis', 'y-axis', 'z-axis']]
        y = df['label']
        scaler = StandardScaler()
        X = scaler.fit_transform(X)
        scaled_X = pd.DataFrame(data = X, columns = ['x-axis', 'y-axis', 'z-axis'])
        scaled_X['label'] = y.values
        
        #Creamos la función que nos devolverá las secuencias
        Fs = 20
        frame_size = Fs*4 # 80
        hop_size = Fs*2 # 40
        
        def get_frames(df, frame_size, hop_size):
        
            N_FEATURES = 3
        
            frames = []
            labels = []
            for i in range(0, len(df) - frame_size, hop_size):
                x = df['x-axis'].values[i: i + frame_size]
                y = df['y-axis'].values[i: i + frame_size]
                z = df['z-axis'].values[i: i + frame_size]
                
                #Devuelve la actividad mas usada de las que ha cogido
                label = stats.mode(df['label'][i: i + frame_size])[0][0]
                frames.append([x, y, z])
                labels.append(label)
        
            #Cambiamos la forma
            frames = np.asarray(frames).reshape(-1, frame_size, N_FEATURES)
            labels = np.asarray(labels)
        
            return frames, labels
        #Aplicamos la función para obtener nuestras secuencias
        X, y = get_frames(scaled_X, frame_size, hop_size)
        
        #Se dividen los datos en un 80% para train (20970) y un 20% para test (5243)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 0, stratify = y)
        
        #Cambiamos la forma de nuestros datos para el modelo
        initial_train_shape = X_train.shape
        initial_test_shape = X_test.shape
        X_train = X_train.reshape(initial_train_shape[0],initial_train_shape[1],initial_train_shape[2], 1)
        X_test = X_test.reshape(initial_test_shape[0],initial_test_shape[1],initial_test_shape[2], 1)
        
        
        #Utilizamos una red convolucional Conv2D
        '''
        MODELO
        '''
        model = Sequential()
        model.add(Conv2D(16, (2, 2), activation = 'relu', input_shape = X_train[0].shape))
        model.add(Dropout(0.1))
        
        model.add(Conv2D(32, (2, 2), activation='relu'))
        model.add(Dropout(0.2))
        
        model.add(Flatten())
        
        model.add(Dense(64, activation = 'relu'))
        model.add(Dropout(0.5))
        
        model.add(Dense(6, activation='softmax'))
        '''
        AJUSTE DEL MODELO
        '''
        model.compile(optimizer=Adam(learning_rate = 0.001), loss = 'sparse_categorical_crossentropy', metrics = ['accuracy'])
        model.fit(X_train, y_train, epochs = 10, validation_data= (X_test, y_test), verbose=1)
        '''
        Guardamos el modelo entrenado para usarlo posteriormente
        '''
        
        model.save("tf_model.h5")
        #Lo guardamos en la bd de mongodb
        MONGO_HOST = "localhost"
        MONGO_PORT = 27017
        MONGO_DB = "model_db"
        myclient = pymongo.MongoClient(MONGO_HOST, MONGO_PORT)
        mydb = myclient[MONGO_DB]
        fs = gridfs.GridFS(mydb)
        model_name = 'tf_model.h5'
        with io.FileIO(model_name, 'r') as fileObject:
            x=fs.put(fileObject, filename=model_name)
            
        return x
            
    #Función para recuperar el modelo desde mongodb
    def modelFromMongo(idModelo):
        MONGO_HOST = "localhost"
        MONGO_PORT = 27017
        MONGO_DB = "model_db"
        con = pymongo.MongoClient(MONGO_HOST, MONGO_PORT)
        db = con[MONGO_DB]
        fs = gridfs.GridFS(db)
        with open('keras_model_fromMongo.h5', 'wb') as fileObject:
            fileObject.write(fs.get(ObjectId(idModelo)).read() )
        


    #Función que nos devuelve la predicción pasandole el conjunto de datos y el modelo entrenado.     
    def dataYprediccion(df, path):
        new_model = keras.models.load_model(path)
        X = df[['x-axis', 'y-axis', 'z-axis']]
        y = df['label']
        scaler = StandardScaler()
        X = scaler.fit_transform(X)
        scaled_X = pd.DataFrame(data = X, columns = ['x-axis', 'y-axis', 'z-axis'])
        scaled_X['label'] = y.values
        scaled_X['timestamp'] = df['timestamp']
        
        #Creamos la función que nos devolverá las secuencias
        Fs = 20
        frame_size = Fs*4 # 80
        hop_size = Fs*2 # 40
        
        
        def get_frames(df, frame_size, hop_size):
        
            N_FEATURES = 3
    
            frames = []
            labels = []
            time = []
            for i in range(0, len(df) - frame_size, hop_size):
                x = df['x-axis'].values[i: i + frame_size]
                y = df['y-axis'].values[i: i + frame_size]
                z = df['z-axis'].values[i: i + frame_size]
                timeS = df['timestamp'].values[i: i + frame_size]
                
                #Devuelve la actividad mas usada de las que ha cogido
                label = stats.mode(df['label'][i: i + frame_size])[0][0]
                frames.append([x, y, z])
                labels.append(label)
                time.append(timeS[0])
        
            #Cambiamos la forma
            frames = np.asarray(frames).reshape(-1, frame_size, N_FEATURES)
            labels = np.asarray(labels)
            time = np.asarray(time)
        
            return frames, labels, time
        #Aplicamos la función para obtener nuestras secuencias
        X, y, time = get_frames(scaled_X, frame_size, hop_size)
        
        X = X.reshape(X.shape[0], X.shape[1], X.shape[2], 1)
        
        y_pred = new_model.predict(X)
        #Toma la clase con la mayor probabilidad de las predicciones
        max_y_pred = np.argmax(y_pred, axis=1)
        #Creamos la nueva columna que contendrá los nombres de las actividades que se realizan:
        actividades = []
        for actividad in max_y_pred:
            if actividad == 0:
                actividades.append("Downstairs")
            if actividad == 1:
                actividades.append("Jogging")
            if actividad == 2:
                actividades.append("Sitting")
            if actividad == 3:
                actividades.append("Standing")
            if actividad == 4:
                actividades.append("Upstairs")
            if actividad == 5:
                actividades.append("Walking")
        
        data = pd.DataFrame()
        data['dateTimes'] = pd.to_datetime(time)
        data['nameActivities'] = actividades
        
        return (data)
        
        
           
        
   
    '''-------------------------FUNCIÓN QUE DEVUELVE LA LÍNEA TEMPORAL----------------------------'''
    def scatterplot(x_data, y_data, x_label, y_label):                
        rcParams['figure.figsize'] = 16, 9
        rcParams['font.size'] = 15
        fig, ax = plt.subplots()
        ax.scatter(x_data, y_data, s = 30, color = "#5F89A1", alpha = 1,)
        
        #Las ponemos como límite en nuestra gráfica
        ax.set_xlabel(x_label)
        ax.set_ylabel(y_label)
        ax.set_ylim(0,6)
        
        #Image from plot 
        fig.tight_layout(pad=0)   
        # To remove the huge white borders
        fig.canvas.draw()
        image_from_plot = np.frombuffer(fig.canvas.tostring_rgb(), dtype=np.uint8)
        image_from_plot = image_from_plot.reshape(fig.canvas.get_width_height()[::-1] + (3,))
        w, h = 512, 512
        data = np.zeros((h, w, 3), dtype=np.uint8)
        data[0:256, 0:256] = [255, 0, 0] # red patch in upper left
        img = Image.fromarray(image_from_plot, 'RGB')
        buf = io.BytesIO()
        img.save(buf, format='JPEG')
        byte_im = buf.getvalue()
                
        return(byte_im)
    
    '''-------------------------FUNCIÓN QUE DEVUELVE HISTOGRAMA----------------------------'''
    
    def histogramActividades(df):
        vt0=0
        vt1=0
        vt2=0
        vt3=0
        vt4=0
        vt5=0
        for i in range(len(df)):
            if df[i] == 'Downstairs':
                vt0 = vt0 + 1
            if df[i] == 'Jogging':
                vt1 = vt1 + 1
            elif df[i] == 'Sitting':
                vt2 = vt2 + 1
            elif df[i] == 'Standing':
                vt3 = vt3 + 1
            elif df[i] == 'Upstairs':
                vt4 = vt4 + 1
            else:
                vt5 = vt5 + 1
        
        tiempoSeRealiza = [0.05*vt0,0.05*vt1,0.05*vt2,0.05*vt3,0.05*vt4,0.05*vt5]
        activ = ['Downstairs', 'Jogging', 'Sitting', 'Standing', 'Upstairs', 'Walking']
        x = activ
        y = tiempoSeRealiza
        
        fig=plt.figure()
        plt.bar(x,y,align='center', color="#5F89A1") # A bar chart
        plt.ylabel('Time')
        plt.xlabel('Activities')
        #Image from plot 
        fig.tight_layout(pad=0)   
        # To remove the huge white borders
        fig.canvas.draw()
        image_from_plot = np.frombuffer(fig.canvas.tostring_rgb(), dtype=np.uint8)
        image_from_plot = image_from_plot.reshape(fig.canvas.get_width_height()[::-1] + (3,))
        w, h = 512, 512
        data = np.zeros((h, w, 3), dtype=np.uint8)
        data[0:256, 0:256] = [255, 0, 0] # red patch in upper left
        img = Image.fromarray(image_from_plot, 'RGB')
        buf = io.BytesIO()
        img.save(buf, format='JPEG')
        byte_im = buf.getvalue()
                
        return(byte_im)
        
    

    '''-------------------------FUNCIÓN QUE DEVUELVE GRÁFICO CIRCULAR----------------------------'''    
    def calculaPorcentaje(df):
        vt0=0
        vt1=0
        vt2=0
        vt3=0
        vt4=0
        vt5=0
        for i in range(len(df)):
            if df[i] == 'Downstairs':
                vt0 = vt0 + 1
            if df[i] == 'Jogging':
                vt1 = vt1 + 1
            elif df[i] == 'Sitting':
                vt2 = vt2 + 1
            elif df[i] == 'Standing':
                vt3 = vt3 + 1
            elif df[i] == 'Upstairs':
                vt4 = vt4 + 1
            else:
                vt5 = vt5 + 1
        
        tiempoSeRealiza = [0.05*vt0,0.05*vt1,0.05*vt2,0.05*vt3,0.05*vt4,0.05*vt5]
        tiempoTotal = 0.05*vt0 + 0.05*vt1 + 0.05*vt2 + 0.05*vt3 + 0.05*vt4 + 0.05*vt5
        porcentajeCada = [x/tiempoTotal for x in tiempoSeRealiza]
        
        dataframe = pd.DataFrame()
        dataframe['porcentaje'] = porcentajeCada
        dataframe['actividad'] = ['Downstairs', 'Jogging', 'Sitting', 'Standing', 'Upstairs', 'Walking']
        
        return dataframe
 
    def circulActividades(data):
        categorias=[]
        datos = []
        #Vemos el número de diferentes actividades que hay
        longitud = []
        for n in data['actividad']:
            if n not in longitud:
                longitud.append(n)
                
        for i in range(len(longitud)):
            if data['porcentaje'][i]>0.001:
                categorias.append(data['actividad'][i])
                datos.append(data['porcentaje'][i])
        colores = ["#2AB0C6","#D39DED","#F8A8A8","#7086ED","#78D08F", "#67A6A6"]
        fig = plt.figure()
        plt.pie(datos,labels=categorias,autopct='%1.00f%%', shadow=False, startangle=90, colors=colores)
        plt.axis("equal")
        #Image from plot
        fig.tight_layout(pad=0)
        # To remove the huge white borders
        fig.canvas.draw()
        image_from_plot = np.frombuffer(fig.canvas.tostring_rgb(), dtype=np.uint8)
        image_from_plot = image_from_plot.reshape(fig.canvas.get_width_height()[::-1] + (3,))
        w, h = 512, 512
        data = np.zeros((h, w, 3), dtype=np.uint8)
        data[0:256, 0:256] = [255, 0, 0] # red patch in upper left
        img = Image.fromarray(image_from_plot, 'RGB')
        buf = io.BytesIO()
        img.save(buf, format='JPEG')
        byte_im = buf.getvalue()
                
        return(byte_im)