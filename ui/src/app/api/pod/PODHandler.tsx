import { Product } from "@/types/all";
import axios, { AxiosInstance } from "axios";

class PODHandler {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: "https://api.printful.com/",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  }

  /**
   * Returns all products in the connected store
   * @returns {Promise<any>}
   */
  async getStoreProducts() {
    try {
      const response = await this.client.get("/store/products");
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
  /**
   * Returns all product categories (follow with getProductsInCategory())
   * @returns {Promise<any>}
   */
  async getProductCategories() {
    try {
      const response = await this.client.get("/categories");
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Returns all products in a category
   * @param categoryId ID of the category to get products from (from getProductCategories())
   * @returns
   */
  async getProductsInCategory(categoryId: number) {
    try {
      const response = await this.client.get(
        `/products?category_id=${categoryId}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Returns details for a product, including variants, region availability, options, price, etc.
   * @param productId ID of the product to get details for (from getProductsInCategory())
   * @returns
   */
  async getProductDetails(productId: number) {
    try {
      const response = await this.client.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createProduct(productData: Product) {
    try {
      const response = await this.client.post("/store/products", productData);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getProductList() {
    try {
      const response = await this.client.get("/products");
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createOrder(orderData: any) {
    try {
      const response = await this.client.post("/orders", orderData);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async uploadDesign(designFileName: string, url: string) {
    try {
      const authResponse = await this.client.post("/oauth/access_token", {
        apiKey: this.apiKey,
      });
      const token = authResponse.data.result;
      console.log("uploading design");
      const uploadResponse = await this.client.post(
        "/files",
        {
          type: "default",
          url: url,
          visible: true,
          fileName: designFileName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return uploadResponse.data.result.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async populateDesignOverProducts(fileId: string, products: any[]) {
    const populatedProducts = [];

    for (const product of products) {
      try {
        const productResponse = await this.client.post("/sync/products", {
          name: product.name,
          external_id: product.externalId,
          variants: product.variants.map((variant) => ({
            ...variant,
            files: [{ id: fileId }],
          })),
        });

        populatedProducts.push(productResponse.data);
      } catch (error) {
        console.error("Error populating product:", product.name, error);
      }
    }

    return populatedProducts;
  }

  private handleError(error: any) {
    console.error(error);
    return null;
  }
}

export default PODHandler;
