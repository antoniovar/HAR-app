import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from "react";
import { GetStaticProps } from 'next'
import { useRouter } from "next/router";
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
    const [isLoading, setLoading] = useState(true);
    const cambiarEstado=()=>{
      setLoading(false)
    }
    return (
    <div className="container">
      <Head>
        <title>Graph</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Activity performed
        </h1>
        

        <div className="grid">
            <p className="description">
              In this graph you can see the activity performed.
            </p>
            {isLoading && <p className="loading">Loading graph...</p>}
            <p className="graph">
                <iframe width="1100" height="475" src={`http://127.0.0.1:8000/showGraph/graph/${id}`}  frameborder="0"  onLoad={()=>cambiarEstado()}></iframe>
            </p>
            
          
        <p>
        <div className='volver'>
        {h.filter(e => e._id == id).map((use) => (
          <form action={`../historyCSV/${use.userID}`}>
            <input type="submit" value="Procesar" className="cambiar-fecha"/>
              Go to data history
          </form>
         ))}
        </div> 
      </p>
      </div>
      </main>

    <style jsx>{`  
        .graph {
          display: flex;
          justify-content: center;
            
        } 
        .loading{
          line-height: 1;
          font-size: 2.5rem;
          color: #5F89A1;
          margin-top: 50px;
          display: flex;
          justify-content: center;
          font-weight: bold;
        }
        .graph .img{
          height: 55%;
          width: 55%;
        } 
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
          line-height: 1;
          font-size: 1.5rem;
          margin-left: 200px;
          margin-right: 200px;
          font-weight:475;
        }
        iframe{
          filter: brightness(1.1);
          mix-blend-mode:multiply;
        }
        .volver {
          text-decoration:none;
          font-weight: 600;
          font-size: 20px;
          color:#FFFFFF;
          padding-top:15px;
          padding-bottom:15px;
          padding-left:40px;
          padding-right:40px;
          background-color:#5F89A1;
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
          width: 230px;

        }

        .volver .cambiar-fecha {
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