const http = require('http');

const API_URL = 'http://localhost:5000'; // Assuming Gateway is on 5000

// Helper to make HTTP requests
const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(`Request failed with status ${res.statusCode}: ${data}`);
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const getProducts = async () => {
  const res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/Product',
    method: 'GET'
  });
  return res.data || res;
};

const getWarehouses = async () => {
  const res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/Warehouse',
    method: 'GET'
  });
  return res.data || res;
};

const createWarehouse = async () => {
  const payload = {
    name: 'Kho Tổng Trung Tâm',
    address: '123 Đường Số 1, KCN Tân Bình, TP.HCM',
    capacity: 100000
  };
  const res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/Warehouse',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, payload);
  return res.data || res;
};

const addInventory = async (warehouseId, productId, quantity) => {
  const payload = { productId, quantity };
  const res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/Warehouse/${warehouseId}/inventory`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, payload);
  return res.data || res;
};

const seed = async () => {
  try {
    console.log('Fetching products...');
    let products = await getProducts();
    if (products.items) products = products.items; // handle pagination response if any

    if (!products || products.length === 0) {
      console.log('No products found to seed.');
      return;
    }
    console.log(`Found ${products.length} products.`);

    console.log('Fetching warehouses...');
    let warehouses = await getWarehouses();
    
    if (!warehouses || warehouses.length === 0) {
      console.log('No warehouse found. Creating one...');
      const newWarehouse = await createWarehouse();
      warehouses = [newWarehouse];
    }
    
    console.log(`Found ${warehouses.length} warehouses.`);

    for (const warehouse of warehouses) {
      // Skip if warehouse already has stock
      if (warehouse.currentStock > 0 || (warehouse.inventories && warehouse.inventories.length > 0)) {
        console.log(`Skipping Warehouse: ${warehouse.name} (${warehouse.id}) because it already has stock.`);
        continue;
      }

      console.log(`Using Warehouse: ${warehouse.name} (${warehouse.id})`);

      let seededCount = 0;
      for (const product of products) {
        const qty = Math.floor(Math.random() * 50) + 50; // 50 to 99
        console.log(`Seeding Product ${product.name} with ${qty} units in ${warehouse.name}...`);
        try {
          await addInventory(warehouse.id, product.id, qty);
          seededCount++;
        } catch (err) {
          console.error(`Failed to seed ${product.name}:`, err);
        }
      }
      
      console.log(`Successfully seeded inventory for ${seededCount} products in ${warehouse.name}.`);
    }
    
    console.log('All done!');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
};

seed();
