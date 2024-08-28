import type { AfterChangeHook } from 'payload/dist/collections/config/types';
import type { Order } from '../../../payload-types';

interface User {
  purchases?: (string | { id: string })[];
}

export const updateUserPurchases: AfterChangeHook<Order> = async ({ doc, req, operation }) => {
  const { payload } = req;

  if ((operation === 'create' || operation === 'update') && doc.orderedBy && doc.items) {
    const orderedBy = typeof doc.orderedBy === 'string' ? doc.orderedBy : doc.orderedBy.id;

    const user = await payload.findByID({
      collection: 'users',
      id: orderedBy,
    });

    if (user) {
      // Type assertion to ensure user.purchases is correctly typed
      const userPurchases = user.purchases as (string | { id: string })[];

      // Type assertion to ensure doc.items is correctly typed
      const itemProducts = doc.items.map(({ product }) =>
        typeof product === 'string' ? product : (product as { id: string }).id
      );

      await payload.update({
        collection: 'users',
        id: orderedBy,
        data: {
          purchases: [
            ...(userPurchases.map(purchase =>
              typeof purchase === 'string' ? purchase : (purchase as { id: string }).id
            ) || []),
            ...itemProducts,
          ],
        },
      });
    }
  }

  return;
};
