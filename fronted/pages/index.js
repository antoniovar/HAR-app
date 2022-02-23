import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';


function Home() {
  const {data, revalidate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  });
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }
  return (
    <div className="container">
      <Head>
        <title>HAR-web</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main>
        <h1 className="title">WELCOME TO HAR</h1>
        <div className="grid">
            {loggedIn && (
                <>
                <h2>Hello {data.name}. What would you like to do? </h2>
                <div className="btns">
                  <form action={`/historyCSV/${data.userId}`}>
                    <button>CSV History</button>
                  </form>
                  <form action={`/insertData/${data.userId}`}>
                    <button>Import data</button>
                  </form>
                  <button
                      onClick={() => {
                      cookie.remove('token');
                      revalidate();
                      }}>
                      Logout
                  </button>
                </div>

                </>
            )}
            {!loggedIn && (
                <div className="grid">
                  <h2 className="description">To start you must Login or Sing Up</h2>
                  <form action="/login">
                    <button id="login">Login</button>
                  </form>
                  <form action="/signup">
                    <button id="signup">Sign Up</button>
                  </form>
                </div>
                   
            )}
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
        .btns{
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 10px;
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
          line-height: 1.5;
          font-size: 1.8rem;
          margin-left: 200px;
          margin-right: 200px;
          font-weight:475;
          
        }
         button {
          font-weight: 60;
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
          min-height: 10px;
          overflow: hidden;
          padding: 10px;
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

export default Home;