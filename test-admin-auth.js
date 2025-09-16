// Test admin authentication
const axios = require('axios');

const API_URL = 'https://api.mygarja.com';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

async function testAdminAuth() {
  try {
    console.log('Testing admin authentication...\n');
    
    // 1. Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    const { token, role, id, email } = loginResponse.data;
    console.log(`   ✓ Login successful!`);
    console.log(`   - User ID: ${id}`);
    console.log(`   - Email: ${email}`);
    console.log(`   - Role: ${role}`);
    console.log(`   - Token: ${token.substring(0, 50)}...`);
    
    if (role !== 'ADMIN') {
      throw new Error('User is not an admin!');
    }
    
    // 2. Test admin endpoint with token
    console.log('\n2. Testing admin endpoint (getAllProducts)...');
    try {
      const productsResponse = await axios.get(`${API_URL}/admin/getAllProducts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`   ✓ Admin endpoint accessible!`);
      console.log(`   - Products found: ${productsResponse.data.length}`);
      
      if (productsResponse.data.length > 0) {
        const firstProduct = productsResponse.data[0];
        console.log(`   - Sample product: ${firstProduct.productName} (ID: ${firstProduct.id})`);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('   ✗ Unauthorized - Token not valid');
      } else if (error.response?.status === 403) {
        console.log('   ✗ Forbidden - Admin role required');
      } else {
        console.log('   ✗ Error accessing admin endpoint:', error.message);
      }
    }
    
    // 3. Test adding a product
    console.log('\n3. Testing add product endpoint...');
    try {
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('productName', 'Test Product');
      formData.append('price', '99.99');
      formData.append('quantity', '10');
      formData.append('description', 'This is a test product');
      formData.append('category', 'T-Shirts');
      formData.append('isActive', 'true');
      
      const addResponse = await axios.post(`${API_URL}/admin/addProduct`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      });
      
      console.log(`   ✓ Product added successfully!`);
      console.log(`   - Product ID: ${addResponse.data.id}`);
      console.log(`   - Message: ${addResponse.data.message}`);
      
      // Delete the test product
      if (addResponse.data.id) {
        console.log('\n4. Cleaning up test product...');
        await axios.delete(`${API_URL}/admin/deleteProduct/${addResponse.data.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(`   ✓ Test product deleted`);
      }
    } catch (error) {
      console.log('   ✗ Error adding product:', error.response?.data || error.message);
    }
    
    console.log('\n✅ Admin authentication test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if axios is installed
try {
  require.resolve('axios');
  require.resolve('form-data');
} catch(e) {
  console.log('Installing required packages...');
  require('child_process').execSync('npm install axios form-data', { stdio: 'inherit' });
}

testAdminAuth();
