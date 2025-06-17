// test-api.js - Node.js script using built-in http module
// Run with: node test-api.js
// Make sure your server is running

const http = require('http');
require('dotenv').config(); // Load environment variables from .env file

const BASE_URL = 'localhost';
const PORT = process.env.PORT || 3000; // Use PORT from .env file, fallback to 3000

console.log(`🔧 Testing API on port: ${PORT}`);

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: `/v1${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`\n${method} ${path}`);
          console.log(`Status: ${res.statusCode}`);
          console.log('Response:', JSON.stringify(jsonData, null, 2));
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          console.log(`\n${method} ${path}`);
          console.log(`Status: ${res.statusCode}`);
          console.log('Response:', data);
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Error with ${method} ${path}:`, error.message);
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function testAPI() {
  console.log('🚀 Testing Library API Endpoints...\n');
  
  try {
    // Test 1: Get all books
    console.log(' Test 1: Getting all books...');
    await makeRequest('GET', '/books');
    
    // Test 2: Get specific book (valid ISBN)
    console.log('\n Test 2: Getting specific book (1984)...');
    await makeRequest('GET', '/books/978-0452284234');
    
    // Test 3: Get non-existent book
    console.log('\n Test 3: Getting non-existent book (should fail)...');
    await makeRequest('GET', '/books/invalid-isbn');
    
    // Test 4: Rent a book (user456 rents 1984)
    console.log('\n Test 4: Renting a book (user456 rents 1984)...');
    const rentalResult = await makeRequest('POST', '/books/978-0452284234/rent', {
      userId: 'user456'
    });
    
    let rentalId = null;
    if (rentalResult && rentalResult.data && rentalResult.data.rentalId) {
      rentalId = rentalResult.data.rentalId;
      console.log(`\n Captured rental ID: ${rentalId}`);
    }
    
    // Test 5: Try to rent same book again (should fail)
    console.log('\n Test 5: Trying to rent same book again (should fail)...');
    await makeRequest('POST', '/books/978-0452284234/rent', {
      userId: 'user456'
    });
    
    // Test 6: Rent different book for same user
    console.log('\n Test 6: Renting different book for same user...');
    await makeRequest('POST', '/books/978-0061120084/rent', {
      userId: 'user456'
    });
    
    // Test 7: Rent book for different user
    console.log('\n Test 7: Renting book for different user (user123)...');
    await makeRequest('POST', '/books/978-0743273565/rent', {
      userId: 'user123'
    });
    
    // Test 8: Try to rent with invalid user
    console.log('\n Test 8: Trying to rent with invalid user (should fail)...');
    await makeRequest('POST', '/books/978-0316769174/rent', {
      userId: 'invalid-user'
    });
    
    // Test 9: Get user's rented books
    console.log('\n Test 9: Getting user456\'s rented books...');
    await makeRequest('GET', '/users/user456/books');
    
    // Test 10: Get books for user with no rentals
    console.log('\n Test 10: Getting books for user with no rentals (user789)...');
    await makeRequest('GET', '/users/user789/books');
    
    // Test 11: Get books for invalid user
    console.log('\n Test 11: Getting books for invalid user (should fail)...');
    await makeRequest('GET', '/users/invalid-user/books');
    
    // Test 12: Return a book (if we have a rental ID)
    if (rentalId) {
      console.log('\n Test 12: Returning the rented book...');
      await makeRequest('POST', `/rentals/${rentalId}/return`);
      
      // Test 13: Try to return same book again
      console.log('\n Test 13: Trying to return same book again (should fail)...');
      await makeRequest('POST', `/rentals/${rentalId}/return`);
    } else {
      console.log('\n  Test 12-13: No rental ID captured, skipping return tests...');
    }
    
    // Test 14: Try to return non-existent rental
    console.log('\n Test 14: Trying to return non-existent rental (should fail)...');
    await makeRequest('POST', '/rentals/invalid-rental-id/return');
    
    // Test 15: Check user's books after return
    console.log('\n Test 15: Checking user456\'s books after return...');
    await makeRequest('GET', '/users/user456/books');
    
    // Test 16: Check all books availability after rentals/returns
    console.log('\n Test 16: Final check - all books availability...');
    await makeRequest('GET', '/books');
    
    console.log('\n✅ API testing complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testAPI();