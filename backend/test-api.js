import http from 'http';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function run() {
  console.log('==================================================');
  console.log('       STARTUP BACKEND API OUTPUT TEST (PHASE 4) ');
  console.log('==================================================\n');

  // 1. Health Check
  console.log('[1] GET /api/health');
  try {
    const res1 = await makeRequest({ hostname: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
    console.log(`STATUS: ${res1.status}`);
    console.log('BODY:', JSON.stringify(res1.data, null, 2));
  } catch (err) {
    console.log('ERROR:', err.message);
  }

  console.log('\n--------------------------------------------------\n');

  // 2. Orders Listing Without Auth (Security Guard Test)
  console.log('[2] GET /api/v1/orders (Unauthorized Test)');
  try {
    const res2 = await makeRequest({ hostname: 'localhost', port: 5000, path: '/api/v1/orders', method: 'GET' });
    console.log(`STATUS: ${res2.status}`);
    console.log('BODY:', JSON.stringify(res2.data, null, 2));
  } catch (err) {
    console.log('ERROR:', err.message);
  }

  console.log('\n--------------------------------------------------\n');

  // 3. Create Order Without Auth (Buyer Guard Test)
  console.log('[3] POST /api/v1/orders (Unauthorized Test)');
  try {
    const postBody = JSON.stringify({
      manufacturerId: 'm-123',
      quantity: 100,
      unitPrice: 15.5,
      totalAmount: 1550,
      shippingAddress: '123 Tech Park, Mumbai',
    });
    const res3 = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/orders',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postBody) },
      },
      postBody
    );
    console.log(`STATUS: ${res3.status}`);
    console.log('BODY:', JSON.stringify(res3.data, null, 2));
  } catch (err) {
    console.log('ERROR:', err.message);
  }

  console.log('\n==================================================');
}

run();
