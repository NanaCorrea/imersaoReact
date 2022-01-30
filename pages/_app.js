function GlobalStyle() {
  return (
    <style global jsx>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
      }
      body {
        font-family: 'Open Sans', sans-serif;
      }
      /* App fit Height */
      html,
      body,
      #__next {
        min-height: 100vh;
        display: flex;
        flex: 1;
      }
      #__next {
        flex: 1;
      }
      #__next > * {
        flex: 1;
      }

      .loading {
        height: 60%;
        width: 60%;
        margin: auto;
      }

      /* Works on Firefox */
      * {
        scrollbar-width: thin;
        scrollbar-color: white #181f25;
      }

      /* Works on Chrome, Edge, and Safari */
      *::-webkit-scrollbar {
        width: 4px;
      }

      *::-webkit-scrollbar-track {
        background: #4b3030;
        border-radius: 20px;
      }

      *::-webkit-scrollbar-thumb {
        /* background-color: #101418; */
        background-color: #d7834f;
        border-radius: 20px;
        /* border: 1px solid white; */
      }
      /* ./App fit Height */
    `}</style>
  )
}

export default function CustomApp({ Component, pageProps }) {
  console.log('Roda em todas as páginas!')
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  )
}
