import Head from 'next/head'
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { connectToDatabase } from '../../util/mongodb.js';


export async function getServerSideProps() {
  
  const { db } = await connectToDatabase();
  const h = await db
    .collection("fs.files")
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();
  return {
    props: {
      h: JSON.parse(JSON.stringify(h)),
    },
  };
}

export default function Home({h}) {
  const router = useRouter();
    const id = router.query.id;
    
  
  return (
    <div className="container">
      <Head>
        <title>HAR-web</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='changeData'>
        <form action="../">
            <input type="submit" value="Go back" className="changeDataButton"/>
            Go home
        </form>
      </div>

      <main>
        <h1 className="title">
          Training completed
        </h1>

        <div className="grid">
        <p className="description">
        Now if you wish, you can see the corresponding graphs with this data or go back to the uploaded data history and see the uploaded data sets and their corresponding graphs with the model already trained. 
        </p>

        <table className="table">
        <tr>
        <td>
        <form action={`/graph/${id}`}>
          <button>View Temporal Graph</button>
        </form>
        </td>
        <td>
        <form action={`/graphHistogram/${id}`}>
          <button>View Histogram</button>
        </form>
        </td>
        </tr>
        <tr>
        <td>
        <form action={`/graphCircular/${id}`}>
          <button>View Pie Chart</button>
        </form>
        </td>
        <td>
        {h.filter(e => e._id == id).map((use) => (
          <form action={`/historyCSV/${use.userID}`}>
            <button>Go to CSV History</button>
          </form>
        ))}
        </td>
        </tr>
        </table>
        
            
              
           
        
        
        

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
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .table{
          margin-left:auto;
          margin-right:auto;
          text-align:center;         
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
          background-color:#5F89A1;
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
            FONT-SIZE: 12pt;
            color:#FFFFFF;
            background-color:#5F89A1;
            border-color: #E0F0EA;
            border-width: 3px;
            border-style: solid;
            border-radius:20px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 2px;
            display:block;
            margin-left: auto;
            margin-right: auto;
            min-height: 6px;
            overflow: hidden;
            padding: 8px;
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