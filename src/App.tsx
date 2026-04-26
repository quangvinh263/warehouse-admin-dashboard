import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { WarehousePage } from './pages/WarehousePage';
import { OrderPage } from './pages/OrderPage';


const App: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/warehouse" element={<WarehousePage />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </AdminLayout>
  );
};

export default App;