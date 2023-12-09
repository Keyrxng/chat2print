import { Product, __Variant } from "@/types/all";
import axios, { AxiosInstance } from "axios";
import probe from "probe-image-size";

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

  /**
   * Creates a new product in the connected store
   * @param productData The product to create (using the Product type)
   * @returns
   */
  async createProduct(productData: Product) {
    try {
      const response = await this.client.post("/store/products", productData);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Returns the print file (print metadata requirements) for a product variant
   * @param productID  ID of the product to get print files for
   * @returns  Returns an array of print files for the product
   */
  async getVariantPrintFiles(productID: number) {
    try {
      const response = await this.client.get(
        `/mockup-generator/printfiles/${productID}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getTemplateLayout(productID: number) {
    try {
      const response = await this.client.get(
        `/mockup-generator/templates/${productID}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createMockupTask(
    imageUrl: string,
    variantIDs: number[],
    type: string,
    top: number,
    left: number,
    right: number,
    bottom: number
  ) {
    try {
      const probed = await probe(imageUrl);
      const imgHeight = probed.height;
      const imgWidth = probed.width;

      const widthFull = 1800;
      const hCalc = (widthFull * imgHeight) / imgWidth;
      const heightFull = Math.round(hCalc);

      const mockupData = {
        variant_ids: variantIDs,
        format: "png",
        files: [
          {
            type: type,
            image_url: imageUrl,
            position: {
              area_width: widthFull,
              area_height: heightFull,
              width: widthFull,
              height: heightFull,
              top: top,
              left: left,
              right: right,
              bottom: bottom,
            },
          },
        ],
      };

      const response = await this.client.post(
        "/mockup-generator/create-task",
        mockupData
      );
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
          variants: product.variants.map((variant: __Variant) => ({
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
