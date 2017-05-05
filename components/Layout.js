import Head from 'next/head';

function Layout({children}){
  return <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  
      <title>Login</title>

      {/* //global jsx does not work inside the Head with initialState check? Just use standard style tag */}
      <style dangerouslySetInnerHTML={{__html: `html{background:#111118;} body{margin:0;padding:0;} body, input, select, option, textarea {font-family: sans-serif;}` }} />
      <noscript><style type="text/css">{`.js{display:none!important;}`}</style></noscript>
  
      <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
      
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    </Head>  
    {children}
  </div>;
}

export default Layout;