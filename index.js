const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
app.use(express.json());

app.post('/render', async (req, res) => {
  const { titulo, imagen } = req.body;

  const html = \`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    body { margin:0;width:1080px;height:1350px;background:url('https://i.imgur.com/LAoeaiT.png') bottom center/cover no-repeat;
      font-family:'Arial',sans-serif;display:flex;align-items:flex-end;justify-content:center;position:relative;overflow:hidden;}
    .destacada { position:absolute;top:0;left:0;width:1080px;height:960px;object-fit:cover; }
    .titulo { position:absolute;bottom:100px;font-size:58px;text-align:center;color:white;
      text-shadow:2px 2px 4px black;width:100%;padding:0 40px; }
    </style></head><body>
    <img class="destacada" src="\${imagen}">
    <div class="titulo">\${titulo}</div>
  </body></html>\`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const buffer = await page.screenshot({ type: 'jpeg', quality: 90 });
  await browser.close();

  res.set('Content-Type', 'image/jpeg');
  res.send(buffer);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});