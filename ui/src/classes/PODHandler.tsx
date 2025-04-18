import { Product, __Variant } from "@/types/all";
import axios, { AxiosInstance } from "axios";
import templates from "@/data/templates";

class PODHandler {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    const key = process.env.PRINTFUL_API_KEY;
    if (!key) throw new Error("Missing Printful API Key");
    this.apiKey = key;
    this.client = axios.create({
      baseURL: "https://api.printful.com/",
      headers: { Authorization: `Bearer ${key}` },
    });
  }

  async getCountries() {
    try {
      const response = await this.client.get("/countries");
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
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
    productID: number,
    imageUrl: string,
    variantIDs: number[],
    scaledWidth: number,
    scaledHeight: number,
    offsetX: number,
    offsetY: number
  ) {
    async function load() {
      const arr = Object.values(templates);
      const template = arr.find(
        (template) => template.printFiles.product_id === productID
      );
      const options = template?.printFiles.options;
      const optionGroups = template?.printFiles.option_groups;
      const placementType = template?.template.variant_mapping[0].templates[0];

      if (!template) {
        throw new Error("Template not found");
      }

      return { placementType, options, optionGroups };
    }

    const { placementType, options, optionGroups } = await load();

    try {
      const mockupData = {
        variant_ids: variantIDs,
        files: [
          {
            type: placementType?.placement || "default",
            image_url: imageUrl,
            position: {
              area_width: scaledWidth,
              area_height: scaledHeight,
              width: scaledWidth,
              height: scaledHeight,
              top: offsetY,
              left: offsetX,
            },
          },
        ],
        options,
        optionGroups,
      };

      const response = await this.client.post(
        `/mockup-generator/create-task/${productID}`,
        mockupData
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getMockupTaskStatus(taskKey: string) {
    try {
      const response = await this.client.get(
        `/mockup-generator/task?task_key=${taskKey}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async estimateCosts(orderData: any) {
    try {
      const response = await this.client.post(
        "/orders/estimate-costs",
        orderData
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async estimateShipping(orderData: any) {
    try {
      const response = await this.client.post("/shipping/rates", orderData);
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

  async getOrders() {
    try {
      const response = await this.client.get("/orders");
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // will setup billing but just leave them as draft orders and fulfill manually for now
  // async shipOrder(orderId: number) {
  //   try {
  //     const response = await this.client.post(`/orders/${orderId}/confirm`);
  //     return response.data;
  //   } catch (error) {}
  // }

  async uploadDesign(designFileName: string, url: string) {
    try {
      const authResponse = await this.client.post("/oauth/access_token", {
        apiKey: this.apiKey,
      });
      const token = authResponse.data.result;
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
    return error.response;
  }
}

export default PODHandler;
