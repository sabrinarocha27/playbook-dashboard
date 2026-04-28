// api/calendar.js — proxy para Google Calendar ICS, resuelve CORS en PlayBook/iPad
module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  var url = req.query.url;
  if (!url) {
    res.status(400).send('Falta URL');
    return;
  }

  // Solo permitir URLs de Google Calendar por seguridad
  if (url.indexOf('calendar.google.com') === -1 &&
      url.indexOf('webcal://') === -1) {
    res.status(403).send('URL no permitida');
    return;
  }

  // webcal:// → https://
  url = url.replace('webcal://', 'https://');

  try {
    var calRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; dashboard/1.0)' }
    });
    var text = await calRes.text();
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.status(200).send(text);
  } catch(e) {
    res.status(500).send('Error al obtener calendario');
  }
};
