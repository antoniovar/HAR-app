import Head from 'next/head'
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { connectToDatabase } from '../../util/mongodb.js';


export async function getServerSideProps() {
  
    await connectToDatabase();
    return {
      props: {},
    };
  }


export default function Home() {
    const router = useRouter();
    const id = router.query.id;
    const [isLoading, setLoading] = useState(false);
    const submitQuery = () => {
      setLoading(true), 
      fetch(`http://127.0.0.1:8000/trainData/train/${id}`)
      .finally(() => {
        window.location.href = `http://localhost:3000/trainDone/${id}`;
      })
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
            Model training
        </h1>

        {!isLoading &&
          <div className="grid">
            <p className="description">
                If you want to train the current model (already trained) also with your selected data set, click the button below.
            </p>
            
            <form onClick={()=>submitQuery()}>
                <button id="boton" type="submit">Train model</button>
            </form>
          </div>
        }
        {isLoading &&
          <div className="grid">
            <p className="description">
            Your model is being trained, this may take time...
            </p>
          </div>
            
        }     
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

        
         button {
            FONT-SIZE: 15pt;
            color:#FFFFFF;
            background-color:#5F89A1;
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
            min-height: 30px;
            overflow: hidden;
            padding: 10px;
            text-align: center;
            width: 200px;

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