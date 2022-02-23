import Head from 'next/head'
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import Router from 'next/router';


export default function Home() {
    
    const { register, handleSubmit, errors, reset } = useForm();
    const router = useRouter();
    const user_id = router.query.user_id;
    
    async function onSubmitForm(data) {
        const file=data.name[0]
        var formdata = new FormData()
        formdata.append("file",file)
        fetch(`http://127.0.0.1:8000/insertDataG/data/${user_id}`, {
          method: 'POST', 
          mode: 'no-cors',
          body: formdata, 
        }).then(res => console.log(res), window.location = `http://localhost:3000/historyCSV/${user_id}`)
        .catch(error => console.error('Error:', error))
        
    }

  return (
    <div className="container">
      <Head>
        <title>HAR-web</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='changeData' onClick={() => Router.back()}>
        
            <input type="submit" value="Go back" className="changeDataButton"/>
            Go back
        
      </div>
      <main>
      
        <h1 className="title">
          Import New Data
        </h1>

        <div className="grid">
        <p className="description">
          If you want to import new data, click the button below.
        </p>
        
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="subirFichero"><input {...register("name")} type="file" id="name" name="name" className="input-file" required/>Click here to upload the data</div>
            <button id="boton" type="submit">Submit</button>
        </form>

      </div>
      </main>
      

    <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #DAE1E5;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          
          align-items: center;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }
        .title,
        .description {
          text-align: center;
        }
        .description {
          line-height: 1.5;
          font-size: 1.8rem;
          margin-left: 200px;
          margin-right: 200px;
          font-weight:475;
        }
        .changeData {
          font-weight: 60;
          color:#FFFFFF;
          background-color:#4B696B;
          border-color: #d8d8d8;
          border-width: 3px;
          border-style: solid;
          border-radius:20px;
          cursor: pointer;
          font-weight: bold;
          margin: 0 auto 0;
          min-height: 10px;
          overflow: hidden;
          padding: 12px;
          text-align: center;
          width: 100px;
          margin-top: 15px;
          margin-right: 15px;
          background-color:#5F89A1;


        }
        label{
            font-size: 180%;
        }
        .changeData .changeDataButton {
          cursor: pointer;
          opacity: 0;
          position: absolute ;
          
         }

        .subirFichero {
          text-decoration:none;
          font-weight: 600;
          font-size: 20px;
          color:#FFFFFF;
          padding-top:15px;
          padding-bottom:15px;
          padding-left:40px;
          padding-right:40px;
          background-color:#B1CBDB;
          border-color: #d8d8d8;
          border-width: 3px;
          border-style: solid;
          border-radius:35px;
          cursor: pointer;
          font-weight: bold;
          margin: 0 auto 0;
          min-height: 15px;
          overflow: hidden;
          padding: 10px;
          position: relative;
          text-align: center;
          width: 400px;
          
        
        }

        .subirFichero .input-file {
          border: 10000px solid transparent;
          cursor: pointer;
          font-size: 10000px;
          margin: 0;
          opacity: 0;
          outline: 0 none;
          padding: 0;
          position: absolute;
          right: -1000px;
          top: -1000px;
         }
         button {
          font-weight: 60;
          color:#FFFFFF;
          background-color:#4B696B;
          border-color: #d8d8d8;
          border-width: 3px;
          border-style: solid;
          border-radius:20px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 20px;
          display:block;
          margin-left: auto;
          margin-right: auto;
          min-height: 10px;
          overflow: hidden;
          padding: 10px;
          text-align: center;
          width: 150px;
          background-color:#5F89A1;


        }


        

        
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

      `}</style>
    </div>
  )
}