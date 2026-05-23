/**
 * KTM API Integration Test Suite
 */
const http = require('http');

const BASE_URL = 'http://localhost:3000';

const makeRequest = (path, method, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.log(`  ❌ FAIL: ${message}`);
      failed++;
    }
  };

  console.log('\n🏁 STARTING KTM Companion API Test Suite...');

  try {
    // Test 1: Register a new user
    console.log('\n📝 Test 1: Registering a unique test user...');
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const regRes = await makeRequest('/api/register', 'POST', {
      name: 'Integration Test Rider',
      email: uniqueEmail,
      password: 'testpassword',
      mobile: '9999999999',
      bikeModel: 'KTM RC 390',
      regNumber: 'TS09EX9999'
    });
    assert(regRes.status === 201, `Status code is 201 (got ${regRes.status})`);
    assert(regRes.body.message === 'Rider registered successfully!', `Body message matches success (got "${regRes.body.message}")`);

    // Test 2: Register duplicate user (expect error)
    console.log('\n📝 Test 2: Attempting duplicate registration...');
    const dupRes = await makeRequest('/api/register', 'POST', {
      name: 'Duplicate Rider',
      email: uniqueEmail,
      password: 'testpassword'
    });
    assert(dupRes.status === 400, `Status code is 400 (got ${dupRes.status})`);
    assert(dupRes.body.error === 'Email already registered', `Error body matches duplicate registration error (got "${dupRes.body.error}")`);

    // Test 3: Log in successfully
    console.log('\n📝 Test 3: Logging in with correct credentials...');
    const loginRes = await makeRequest('/api/login', 'POST', {
      email: uniqueEmail,
      password: 'testpassword'
    });
    assert(loginRes.status === 200, `Status code is 200 (got ${loginRes.status})`);
    assert(loginRes.body.token !== undefined, 'Response includes JWT session token');
    assert(loginRes.body.user.name === 'Integration Test Rider', `Logged in username matches (got "${loginRes.body.user.name}")`);

    // Test 4: Log in with wrong password (expect error)
    console.log('\n📝 Test 4: Logging in with incorrect password...');
    const badLoginRes = await makeRequest('/api/login', 'POST', {
      email: uniqueEmail,
      password: 'wrongpassword'
    });
    assert(badLoginRes.status === 401, `Status code is 401 (got ${badLoginRes.status})`);
    assert(badLoginRes.body.error === 'Invalid credentials', `Error body matches invalid credentials (got "${badLoginRes.body.error}")`);

    // Test 5: Fetch active bike details
    console.log('\n📝 Test 5: Fetching active bike details...');
    const bikeRes = await makeRequest('/api/bike', 'GET');
    assert(bikeRes.status === 200, `Status code is 200 (got ${bikeRes.status})`);
    assert(bikeRes.body.name === "Integration Test Rider's Duke", `Bike name matches user's name prefix (got "${bikeRes.body.name}")`);
    assert(bikeRes.body.model === 'KTM RC 390', `Bike model matches user's bike (got "${bikeRes.body.model}")`);
    assert(bikeRes.body.status === 'Connected via BLE', 'Bike BLE status is online');

    // Test 6: Fetch rides history
    console.log('\n📝 Test 6: Fetching ride history entries...');
    const ridesRes = await makeRequest('/api/rides', 'GET');
    assert(ridesRes.status === 200, `Status code is 200 (got ${ridesRes.status})`);
    assert(Array.isArray(ridesRes.body), 'Rides response is an array');

    // Test 7: Fetch leaderboard rankings
    console.log('\n📝 Test 7: Fetching leaderboard rankings...');
    const boardRes = await makeRequest('/api/leaderboard', 'GET');
    assert(boardRes.status === 200, `Status code is 200 (got ${boardRes.status})`);
    assert(Array.isArray(boardRes.body), 'Leaderboard response is an array');
    assert(boardRes.body.length >= 1, 'Leaderboard has at least one entry');
    
    // Ensure it's sorted descending
    let sorted = true;
    for (let i = 0; i < boardRes.body.length - 1; i++) {
      if (boardRes.body[i].distance < boardRes.body[i+1].distance) {
        sorted = false;
      }
    }
    assert(sorted === true, 'Leaderboard is sorted in descending order of distance');

    console.log(`\n🎉 INTEGRATION TEST RUN COMPLETE: ${passed} PASSED, ${failed} FAILED.`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('❌ Integration Test Script Error:', err);
    process.exit(1);
  }
};

runTests();
