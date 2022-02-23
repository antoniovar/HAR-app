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
  const user_id = router.query.user_id;
  
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
          Data Uploaded
        </h1>

        <div className="grid">
        <p className="description">
          In this table you can see all the data sets uploaded. You can also access your graphics
        </p>

        
        
        <table border="0" className="table">
          <tr>
            <th>Filename</th>
            <th>Upload Date</th>
            <th>Temporal graph</th>
            <th>Histogram</th>
            <th>Pie chart</th>
            <th>Train Model</th>
          </tr>   
          
          {h.filter(e => e.userID == user_id).map((use) => (
            <tr>
            <td>{use.filename}</td>
            <td>{use.uploadDate}</td>
            <td>
              <form action={`/graph/${use._id}`}>
                <button>View</button>
              </form>
            </td>
            <td>
              <form action={`/graphHistogram/${use._id}`}>
                <button>View</button>
              </form>
            </td>
            <td>
              <form action={`/graphCircular/${use._id}`}>
                <button>View</button>
              </form>
            </td>
            <td>
              <form action={`/train/${use._id}`}>
                <button>Select this data</button>
              </form>
            </td>
            </tr>
          
          ))}
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
          
        .table{
          background-color:#DAE1E5;
          margin-left:auto;
          margin-right:auto;
          text-align:center;         
        }
        .table tr:hover {
          background-color: #ADCBDD;
       }
        th, td {
          padding: 0.4em;
       }
          
        button {
          font-weight: 30;
          color:#FFFFFF;
          background-color:#5F89A1;
          border-color: #d8d8d8;
          border-width: 2px;
          border-style: solid;
          border-radius:20px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 0px;
          display:block;
          margin-left: auto;
          margin-right: auto;
          min-height: 6px;
          overflow: hidden;
          padding: 6px;
          text-align: center;
          width: 150px;

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