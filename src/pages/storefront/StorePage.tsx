import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Typography, Button, message, Skeleton, Input, Select, Tag } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { catalogService } from '../../services/catalogService';

import { useCart } from '../../contexts/CartContext';

const { Title, Text } = Typography;
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

export const StorePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await catalogService.getProducts();
      setProducts(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.price
    });
    message.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  // Tính toán danh sách category duy nhất
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.categoryName || (p as any).category || p.categoryId));
    return ['all', ...Array.from(cats)].filter(Boolean);
  }, [products]);

  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'all' || (p.categoryName || (p as any).category || p.categoryId) === selectedCategory;
      
      const price = parseFloat(p.price);
      let matchPrice = true;
      if (selectedPriceRange === 'under500') matchPrice = price < 500;
      else if (selectedPriceRange === '500-1000') matchPrice = price >= 500 && price <= 1000;
      else if (selectedPriceRange === 'over1000') matchPrice = price > 1000;

      return matchSearch && matchCat && matchPrice;
    });
  }, [products, searchTerm, selectedCategory, selectedPriceRange]);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>Khám phá Sản phẩm Mới nhất</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Hệ thống đặt hàng trực tuyến Demo Microservices
        </Text>
      </div>

      <Card style={{ marginBottom: 24, borderRadius: 12, backgroundColor: '#fafafa' }} bordered={false}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search 
              placeholder="Tìm kiếm tên sản phẩm..." 
              allowClear 
              enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>}
              size="large"
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} md={16} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FilterOutlined style={{ marginRight: 8, fontSize: 18, color: '#8c8c8c' }} />
              <Text strong style={{ marginRight: 8 }}>Danh mục:</Text>
              <Select 
                value={selectedCategory}
                size="large"
                style={{ width: 160 }}
                onChange={(value) => setSelectedCategory(value)}
              >
                <Option value="all">Tất cả</Option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <Option key={cat as string} value={cat}>{cat}</Option>
                ))}
              </Select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text strong style={{ marginRight: 8 }}>Giá:</Text>
              <Select 
                value={selectedPriceRange}
                size="large"
                style={{ width: 160 }}
                onChange={(value) => setSelectedPriceRange(value)}
              >
                <Option value="all">Tất cả mức giá</Option>
                <Option value="under500">Dưới $500</Option>
                <Option value="500-1000">$500 - $1000</Option>
                <Option value="over1000">Trên $1000</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <Text strong>Hiển thị: {filteredProducts.length} sản phẩm</Text>
      </div>

      <Skeleton loading={loading} active>
        <Row gutter={[24, 24]}>
          {filteredProducts.map(product => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={
                  <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: 20 }}>
                    <img 
                      alt={product.name} 
                      src={product.imageUrl || 'https://via.placeholder.com/200'} 
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                }
                actions={[
                  <Button 
                    type="primary" 
                    icon={<ShoppingCartOutlined />} 
                    onClick={() => handleAddToCart(product)}
                    style={{ width: '80%' }}
                  >
                    Thêm vào giỏ
                  </Button>
                ]}
              >
                <Meta 
                  title={<span style={{ whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: 44 }}>{product.name}</span>}
                  description={
                    <div>
                      <Tag color="blue" style={{ marginBottom: 8 }}>{product.categoryName || (product as any).category || product.categoryId}</Tag>
                      <br />
                      <Text strong style={{ fontSize: 18, color: '#cf1322', display: 'block', marginBottom: 8 }}>${product.price}</Text>
                      <Typography.Paragraph 
                        type="secondary" 
                        ellipsis={{ rows: 2 }} 
                        style={{ fontSize: 13, marginBottom: 0, height: 40 }}
                      >
                        {product.description}
                      </Typography.Paragraph>
                    </div>
                  } 
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Skeleton>
    </div>
  );
};
