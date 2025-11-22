export interface ProductType {
  id: string;
  productName: string;
  productInfo: string;
  productImageUrl: string;
  product_price: number;
  brand: string;
}

export interface ProductTypeAdd {
  product_name: string;
  product_price: number;
  brand: string;
  product_info: string;
  product_image_url: string;
}
