// api/weather.js — proxy para clima, resuelve CORS en PlayBook/iPad
module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  var city = req.query.city;
  if (!city) {
    res.status(400).json({ error: 'Falta ciudad' });
    return;
  }

  try {
    // 1. Geocoding
    var geoRes = await fetch(
      'https://geocoding-api.open-meteo.com/v1/search?name=' +
      encodeURIComponent(city) + '&count=1&format=json'
    );
    var geoData = await geoRes.json();

    if (!geoData.results || !geoData.results[0]) {
      res.status(404).json({ error: 'Ciudad no encontrada' });
      return;
    }

    var r = geoData.results[0];

    // 2. Clima
    var wxRes = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=' + r.latitude +
      '&longitude=' + r.longitude +
      '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto'
    );
    var wxData = await wxRes.json();

    res.status(200).json({
      city: r.name,
      country: r.country_code,
      current: wxData.current
    });

  } catch(e) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};
