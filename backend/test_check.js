const http = require('http');

const data = JSON.stringify({
  message: "Congratulations! You've won $5000 in the Amazon lottery. Claim now by sending your bank details to claim@prize-win.com"
});

const req = http.request('http://127.0.0.1:5000/api/check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', (e) => console.error('Request error:', e));
req.write(data);
req.end();
