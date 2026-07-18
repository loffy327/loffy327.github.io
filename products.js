// Mock Database for Bubble Tea Shop

const categories = [
  { id: 'milktea', name: 'Trà Sữa', icon: '🧋' },
  { id: 'fruittea', name: 'Trà Trái Cây', icon: '🍹' },
  { id: 'iceblend', name: 'Đá Xay', icon: '🧊' },
  { id: 'freshmilk', name: 'Sữa Tươi', icon: '🥛' },
  { id: 'macchiato', name: 'Macchiato', icon: '☕' }
];

const toppings = [
  { id: 'boba', name: 'Trân châu đen', price: 10000 },
  { id: 'white_boba', name: 'Trân châu trắng', price: 10000 },
  { id: 'pudding', name: 'Pudding trứng', price: 12000 },
  { id: 'coconut_jelly', name: 'Thạch dừa', price: 8000 },
  { id: 'aloe_vera', name: 'Nha đam', price: 10000 },
  { id: 'cheese_foam', name: 'Kem cheese', price: 15000 }
];

const products = [
  {
    id: 'p1',
    name: 'Trà sữa trân châu đường đen',
    description: 'Sự kết hợp hoàn hảo giữa hồng trà sữa đậm vị và trân châu nấu với đường đen Okinawa dẻo thơm, ngọt ngào.',
    categoryId: 'milktea',
    image: 'assets/images/tra-sua-tran-chau-duong-den.png',
    prices: { s: 35000, m: 45000, l: 55000 },
    rating: 4.9,
    reviews: 1250,
    isPopular: true,
    isNew: false
  },
  {
    id: 'p2',
    name: 'Trà sữa matcha',
    description: 'Trà sữa với bột matcha nguyên chất nhập khẩu từ Nhật Bản, thơm lừng vị trà xanh đặc trưng.',
    categoryId: 'milktea',
    image: 'assets/images/tra-sua-matcha.png',
    prices: { s: 39000, m: 49000, l: 59000 },
    rating: 4.7,
    reviews: 840,
    isPopular: true,
    isNew: false
  },
  {
    id: 'p3',
    name: 'Trà đào cam sả',
    description: 'Thức uống thanh mát giải nhiệt với vị chua ngọt của cam, thơm nồng của sả và những miếng đào ngâm giòn ngọt.',
    categoryId: 'fruittea',
    image: 'assets/images/tra-dao-cam-sa.png',
    prices: { s: 35000, m: 45000, l: 55000 },
    rating: 4.8,
    reviews: 2100,
    isPopular: true,
    isNew: false
  },
  {
    id: 'p4',
    name: 'Trà vải dưa hấu',
    description: 'Sự kết hợp độc đáo giữa vị ngọt thanh của vải và mát lạnh của dưa hấu tươi.',
    categoryId: 'fruittea',
    image: 'assets/images/tra-vai.png',
    prices: { s: 39000, m: 49000, l: 59000 },
    rating: 4.5,
    reviews: 420,
    isPopular: false,
    isNew: true
  },
  {
    id: 'p5',
    name: 'Oreo đá xay',
    description: 'Bánh Oreo xay nhuyễn cùng sữa và đá, phủ lên trên lớp kem tươi béo ngậy.',
    categoryId: 'iceblend',
    image: 'assets/images/oreo-da-xay.png',
    prices: { s: 45000, m: 55000, l: 65000 },
    rating: 4.6,
    reviews: 650,
    isPopular: true,
    isNew: false
  },
  {
    id: 'p6',
    name: 'Sữa tươi trân châu đường đen',
    description: 'Sữa tươi thanh trùng Dalat Milk kết hợp cùng lớp đường đen bám quanh thành ly tuyệt đẹp.',
    categoryId: 'freshmilk',
    image: 'assets/images/sua-tuoi-tran-chau.png',
    prices: { s: 35000, m: 45000, l: 55000 },
    rating: 4.9,
    reviews: 1800,
    isPopular: true,
    isNew: false
  },
  {
    id: 'p7',
    name: 'Hồng trà Macchiato',
    description: 'Hồng trà nguyên bản thơm dịu, phủ lên trên lớp kem cheese mặn mặn béo ngậy.',
    categoryId: 'macchiato',
    image: 'assets/images/hong-tra-macchiato.png',
    prices: { s: 40000, m: 50000, l: 60000 },
    rating: 4.8,
    reviews: 950,
    isPopular: false,
    isNew: false
  },
  {
    id: 'p8',
    name: 'Trà ô long xoài macchiato',
    description: 'Trà ô long rang kết hợp mứt xoài tươi và lớp kem phô mai béo ngậy.',
    categoryId: 'macchiato',
    image: 'assets/images/o-long-xoai-macchiato.png',
    prices: { s: 45000, m: 55000, l: 65000 },
    rating: 4.7,
    reviews: 320,
    isPopular: false,
    isNew: true
  }
];

// Helper functions for data access
const getProductById = (id) => products.find(p => p.id === id);
const getProductsByCategory = (categoryId) => products.filter(p => p.categoryId === categoryId);
const getPopularProducts = (limit = 4) => products.filter(p => p.isPopular).slice(0, limit);
const searchProducts = (keyword) => {
  const lowerKw = keyword.toLowerCase();
  return products.filter(p => p.name.toLowerCase().includes(lowerKw) || p.description.toLowerCase().includes(lowerKw));
};

export {
  categories,
  toppings,
  products,
  getProductById,
  getProductsByCategory,
  getPopularProducts,
  searchProducts
};
