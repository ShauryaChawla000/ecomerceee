import type { AfterDeleteHook } from 'payload/dist/collections/config/types';
import type { Product } from '../../../payload-types';

interface CartItem {
  product: string;
}

interface User {
  id: string;
  cart: {
    items: CartItem[];
  };
}

interface FindResult<T> {
  totalDocs: number;
  docs: T[];
}

export const deleteProductFromCarts: AfterDeleteHook<Product> = async ({ req, id }) => {
  // Fetch users with the product in their cart
  const result = await req.payload.find({
    collection: 'users',
    overrideAccess: true,
    where: {
      'cart.items.product': {
        equals: id,
      },
    },
  }) as unknown as FindResult<User>; // Type assertion to specify the expected result type

  if (result.totalDocs > 0) {
    await Promise.all(
      result.docs.map(async (user) => {
        // Type assertion for cart to ensure correct structure
        const cart = user.cart as { items: CartItem[] };
        const itemsWithoutProduct = cart.items.filter(item => item.product !== id);
        const cartWithoutProduct = {
          ...cart,
          items: itemsWithoutProduct,
        };

        return req.payload.update({
          collection: 'users',
          id: user.id,
          data: {
            cart: cartWithoutProduct,
          },
        });
      }),
    );
  }
};
