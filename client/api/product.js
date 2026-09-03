export default async function handler(req, res) {
  const { id } = req.query;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    // Fetch product details from the backend
    const productRes = await fetch(`https://tohfabox25.onrender.com/api/products/${id}`);
    const productData = await productRes.json();
    
    // Fetch the base HTML
    const htmlRes = await fetch(`${baseUrl}/index.html`);
    let html = await htmlRes.text();

    if (productData.success && productData.data) {
      const product = productData.data;
      const title = product.name;
      // Strip HTML tags from description for meta tags
      const description = product.description ? product.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : 'Check out this amazing product on Tohfabox25';
      const image = product.images && product.images.length > 0 ? product.images[0].url : `${baseUrl}/logo.png`;
      const productUrl = `${baseUrl}/products/${id}`;

      // Replace the default Open Graph tags with the dynamic product ones
      // We'll replace the specific default tags in the HTML
      html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`);
      html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`);
      html = html.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`);
      html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${productUrl}" />`);
      html = html.replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="product" />`);
      
      // Also add/update Twitter tags
      if (html.includes('<meta name="twitter:card"')) {
          html = html.replace('<meta name="twitter:card" content="summary_large_image" />', 
              `<meta name="twitter:card" content="summary_large_image" />
               <meta name="twitter:title" content="${title}" />
               <meta name="twitter:description" content="${description}" />
               <meta name="twitter:image" content="${image}" />`
          );
      }
      
      // Update page title
      html = html.replace(/<title>.*?<\/title>/, `<title>${title} | Tohfabox25</title>`);
    }

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300'); // Cache for performance
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in OG generation:', error);
    // Fallback to normal index.html without dynamic tags
    try {
      const htmlRes = await fetch(`${baseUrl}/index.html`);
      const html = await htmlRes.text();
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } catch (fallbackError) {
      res.status(500).send('Internal Server Error while loading app.');
    }
  }
}
