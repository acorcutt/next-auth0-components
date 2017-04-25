import Head from 'next/head';

export default ({children, className})=>(<div className={className}>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

    <title>Next Auth0 Components</title>
    <meta name="description" content="Components for quickly adding Auth0 support to a Next.js app." />

    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/tachyons/4.7.0/tachyons.min.css" />
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300i,400,400i,600,600i,700,700i" />
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

    {/* global jsx does not work inside the Head with initialState check? Just use standard style tag */}
    <style dangerouslySetInnerHTML={{__html: `html{background:white;} body, input, select, option, textarea {font-family: 'Source Sans Pro', sans-serif;}` }} />
    <noscript><style type="text/css">{`.js{display:none!important;}`}</style></noscript>

    <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
  </Head>
  {children}      
</div>);