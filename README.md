# Setup  

In order to run the program, you must download both the backend and the fronted. Once downloaded, you need to lift the server through the terminal, for that we do:  
  🟠 Fronted: We access the directory where the backend folder has, we access the backend and har (within the backend) once here we execute the following code: 'uvicorn app: app'.         Example:  
  
        
          cd users/userName/desktop/backend/har
          uvicorn app:app
        
        
  🟠 Backend: Now again through the use of terminal, we access the directory that contains the fronted folder, we enter it and execute the following command: 'npm run dev'. 
      Example:  
      
        
          cd users/userName/desktop/fronted
          npm run dev
         
        
 Once we have done this in the terminal itself that we have executed 'npm run dev' it will tell us which is the server we must access (By default 'http: // localhost: 3000')
