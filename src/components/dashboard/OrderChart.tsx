import React from 'react';
import { Card } from 'antd';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OrderChartProps {
  data: any[];
}

export const OrderChart: React.FC<OrderChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatYAxisRevenue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ₫`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K ₫`;
    }
    return `${value} ₫`;
  };

  return (
    <Card 
      title={<span style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Thống kê Đơn hàng & Doanh thu (7 ngày qua)</span>} 
      variant='borderless' 
      className="premium-stat-card" 
      style={{ borderRadius: 16, height: '100%' }}
    >
      <div style={{ width: '100%', height: 350, marginTop: 16 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
            />
            {/* Trục Y bên trái cho số lượng đơn hàng */}
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              label={{ value: 'Đơn hàng', angle: -90, position: 'insideLeft', offset: 0, fill: '#9ca3af', style: { fontSize: 12 } }}
            />
            {/* Trục Y bên phải cho doanh thu */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tickFormatter={formatYAxisRevenue}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              label={{ value: 'Doanh thu', angle: 90, position: 'insideRight', offset: 0, fill: '#9ca3af', style: { fontSize: 12 } }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 12, 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#ffffff'
              }}
              formatter={(value: any, name: any) => {
                if (name === 'Doanh thu') return [formatCurrency(Number(value)), name];
                return [`${value} đơn`, name];
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 13 }} />
            
            {/* Doanh thu - biểu đồ diện tích với gradient màu xanh ngọc lục bảo */}
            <Area 
              yAxisId="right"
              type="monotone" 
              name="Doanh thu"
              dataKey="revenue" 
              fill="url(#colorRevenue)" 
              stroke="#10b981" 
              strokeWidth={2}
            />
            
            {/* Đơn hàng - biểu đồ đường nét với màu xanh biển */}
            <Line 
              yAxisId="left"
              type="monotone" 
              name="Đơn hàng"
              dataKey="orders" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }} 
              activeDot={{ r: 6 }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

