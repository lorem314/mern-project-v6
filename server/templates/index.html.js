export default ({ markup = "", styleTags = "" }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' blob: data:; media-src 'self' blob: data:;">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MERN-Project-V6</title>
      ${styleTags}
    </head>
    <body>
      <div id="root">${markup}</div>
      <script type="text/javascript" src="/dist/bundle.js"></script>
    </body>
    </html>
  `
}
