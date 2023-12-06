import { createClient, SupabaseClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

class Supabase {
  public supabase: SupabaseClient;

  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      console.log("supabaseUrl" , supabaseUrl);
      console.log("supabaseKey" , supabaseKey);
      

      
      throw new Error("DB Credentials not found");
    }
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        // persistSession: false,
        // autoRefreshToken: false,
        // detectSessionInUrl: false,
      },
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////// Auth //////////// Auth //////////// Auth //////////// Auth //////////// Auth ////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async errorHandler(error: any) {
    if (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * Signs up a user with the given email and password
   * @param email  The email of the user to sign up
   * @param password  The password of the user to sign up
   * @returns  The user object and error if any
   */
  async signUp(email: string, password: string) {
    const { data: user, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return await this.errorHandler(error);
    }

    return { user };
  }

  async sessionRestore(at, rt) {
    const { data, error } = await this.supabase.auth.setSession({
      access_token: at,
      refresh_token: rt,
    });
    if (error) {
      return this.errorHandler(error);
    }
    return { data };
  }

  /**
   * Signs in a user with the given email and password
   * @param email  The email of the user to sign in
   * @param password  The password of the user to sign in
   * @returns  The user object and error if any
   */
  async signIn(email: string, password: string) {
    const { data: user, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return this.errorHandler(error);
    }

    return user;
  }

  /**
   * Signs in a user with the given email and password
   * @returns The user object and error if any
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      return this.errorHandler(error);
    } else {
      return { user: null };
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////// Orders //////////// Orders //////////// Orders //////////// Orders //////////// Orders ////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Creates a new order with the given order object and user id
   * @param order  The order to create
   * @returns  The order object and error if any
   */
  async createOrder(order: any, userId: string) {
    const { data, error } = await this.supabase
      .from("orders")
      .insert([{ ...order, user_id: userId }]);

    if (error) {
      return this.errorHandler(error);
    }
    return { data };
  }

  /**
   * Deletes an order with the given order id and user id
   * @param orderId  The id of the order to delete
   * @returns  The order object and error if any
   */
  async deleteOrder(orderId: string, userId: string) {
    const { error } = await this.supabase
      .from("orders")
      .delete()
      .eq("order_id", orderId)
      .eq("user_id", userId)
      .select();
    if (error) {
      return this.errorHandler(error);
    } else {
      return true;
    }
  }

  /**
   *  Gets an order with the given order id and order object
   * @param orderId  The id of the order to update
   * @param order  The order object to update
   * @returns  The order object and error if any
   */
  async updateOrder(orderId: string, order: any) {
    const { data, error } = await this.supabase
      .from("orders")
      .update(order)
      .eq("order_id", orderId)
      .select();

    if (error) {
      return this.errorHandler(error);
    }
    return { data };
  }

  /**
   *  Gets all of the orders for the given user
   * @param userId  The id of the user to get the orders for
   * @returns  The orders and error if any
   */
  async getUserOrders(userId: string) {
    const { data, error } = await this.supabase
      .from("orders")
      .select()
      .eq("user_id", userId);

    if (error) {
      return this.errorHandler(error);
    }
    return { data };
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////// Users //////////// Users //////////// Users //////////// Users //////////// Users ///////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Gets the user with the given email
   * @param email  The email of the user to get
   * @returns  The user object and error if any
   */
  async getUserByEmail(email: string) {
    const { data: user, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) {
      return this.errorHandler(error);
    }
    return { user };
  }

  /**
   * Gets the user with the given id
   * @param userId  The id of the user to get
   * @returns  The user object and error if any
   */
  async getUserById(userId: string) {
    const { data: user, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", userId);

    if (error) {
      return this.errorHandler(error);
    }

    return { user };
  }

  /**
   * Creates a new user with the given email
   * @param email  The email of the user to create
   * @returns  The user object and error if any
   */
  async createUser(email: string) {
    const { data: user, error } = await this.supabase
      .from("users")
      .insert([{ email }]);

    if (error) {
      return this.errorHandler(error);
    }

    return { user };
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////// Shipping //////////// Shipping //////////// Shipping //////////// Shipping //////////// Shipping ////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Creates a new shipping address for the given user
   * @param address  The address to create
   * @param userId  The id of the user to create the address for
   * @returns  The address object and error if any
   */
  async createShippingAddress(address: any, userId: string) {
    const { data, error } = await this.supabase
      .from("addresses")
      .insert([{ ...address, user_id: userId }]);

    if (error) {
      return this.errorHandler(error);
    }
    return { data };
  }

  async deleteShippingAddress(addressId: string, userId: string) {
    const { error } = await this.supabase
      .from("addresses")
      .delete()
      .eq("address_id", addressId)
      .eq("user_id", userId)
      .select();

    if (error) {
      return this.errorHandler(error);
    } else {
      return true;
    }
  }

  async updateShippingAddress(addressId: string, address: any) {
    const { data, error } = await this.supabase
      .from("addresses")
      .update(address)
      .eq("address_id", addressId)
      .select();

    if (error) {
      return this.errorHandler(error);
    }

    return { data };
  }

  async getUserShippingAddresses(userId: string) {
    const { data, error } = await this.supabase
      .from("addresses")
      .select()
      .eq("user_id", userId);

    if (error) {
      return this.errorHandler(error);
    }

    return { data };
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///// Saved Designs //////////// Saved Designs //////////// Saved Designs //////////// Saved Designs ////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Gets all of the saved designs for the given user
   * @param userId  The id of the user to get the designs for
   * @returns  The designs and error if any
   */
  async getUserDesigns(userId: string) {
    const { data: designs, error } = await this.supabase
      .from("saved_designs")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return this.errorHandler(error);
    }

    return { designs };
  }

  /**
   * Creates a new design for the given user
   * @param userId The id of the user to create the design for
   * @param name The name of the design to create
   * @returns The design and error if any
   */
  async createDesign(userId: string, name: string, thumbnail: string) {
    const { data: design, error } = await this.supabase
      .from("saved_designs")
      .insert([{ user_id: userId, name }]);

    if (error) {
      return this.errorHandler(error);
    }

    return { design };
  }

  /**
   * Creates many new designs for the given user
   * @param userId The id of the user to create the designs for
   * @param designs Array of designs to create
   * @returns The designs and error if any
   */
  async createManyDesigns(userId: string, designs: { name: string }[]) {
    const { data: design, error } = await this.supabase
      .from("saved_designs")
      .insert(designs.map((design) => ({ user_id: userId, ...design })))
      .select();

    if (error) {
      return this.errorHandler(error);
    }

    return { design };
  }

  /**
   * Deletes a design for the given user
   * @param designId  The id of the design to delete
   * @returns The design and error if any
   */
  async deleteDesign(designId: number) {
    const { error } = await this.supabase
      .from("saved_designs")
      .delete()
      .eq("id", designId);

    if (error) {
      return this.errorHandler(error);
    } else {
      return true;
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///// Storage Buckets //////////// Storage Buckets //////////// Storage Buckets //////////// Storage Buckets ////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //!!! RLS is enabled on the design_images bucket so only the user can access only their own folder and files !!!\\

  /**
   * Creates a new folder for the given user in the design_images bucket with a placeholder so the folder is created
   * @param userId  The id of the user to create the folder for
   * @returns  The folder object and error if any
   */
  async createUserFolder(userId: string) {
    const { data: folder, error } = await this.supabase.storage
      .from("design_images")
      .upload(`user-${userId}/designs/placeholder.webp`, "", {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return this.errorHandler(error);
    }

    return { folder };
  }

  /**
   *  Gets the folder for the given user in the design_images bucket
   * @param userId  The id of the user to get the folder for
   * @returns  The folder object and error if any
   */
  async getUserFolder(userId: string) {
    const { data: folder, error } = await this.supabase.storage
      .from("design_images")
      .list(`user-${userId}/designs/`, { limit: 1 });

    if (error) {
      return this.errorHandler(error);
    }

    return { folder };
  }
}

export default Supabase;
