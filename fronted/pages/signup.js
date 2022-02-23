import React, {useState} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';
import Head from 'next/head';

const Signup = () => {
  const [signupError, setSignupError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.error) {
          setSignupError(data.message);
        }
        if (data && data.token) {
          //set cookie
          cookie.set('token', data.token, {expires: 2});
          Router.push('/');
        }
      });
  }
  return (
    <div className="container">
      <Head>
        <title>HAR-web</title>
      </Head>
      <main>
        <h1 className="title">Sign Up</h1>
        <div className="grid">
          <form onSubmit={handleSubmit}>
            <p className="description">Name:
              <input className="input-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                type="string"
              required/>
            </p>
            <p className="description">Email:
              <input className="input-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="email"
              required/>
            </p>
          <p className="description">Password:
              <input className="input-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                type="password"
              required/>
            </p>
            <button type="submit" value="Submit"> Submit </button>
            {signupError && <p style={{color: 'red'}}>{signupError}</p>}
          </form>
        </div>
      </main>

    <style jsx>{`
    .container {
      min-height: 100vh;
      padding: 0 0.5rem;
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
      text-align: left;
    }
    .description {
      line-height: 1.5;
      font-size: 1.4rem;
      margin-left: 200px;
      margin-right: 200px;
    }
    .description .input-email{
      margin-left: 60px;
      background-color:#EBF0F0;
    }
    .description .input-password{
      margin-left: 20px;
      background-color:#EBF0F0;
    }
    .description .input-name{
      margin-left: 54px;
      background-color:#EBF0F0;
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

export default Signup;