const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion = '2024-01';
const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

export async function shopifyFetch({ query, variables = {} }) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Network Error: ${response.status}`);
    }

    const { data, errors } = await response.json();
    if (errors) {
      throw new Error(errors[0]?.message || 'GraphQL Query Failed');
    }
    return data;
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

const CREATE_CART_MUTATION = `
  mutation CreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
    }
  }
`;

// Add the exclamation mark (!) here as well: [CartLineInput!]!
const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
    }
  }
`;
export async function addToCart(merchandiseId, quantity = 1) {
  const existingCartId = localStorage.getItem('shopify_cart_id');
  if (existingCartId) {
    const data = await shopifyFetch({
      query: ADD_TO_CART_MUTATION,
      variables: {
        cartId: existingCartId,
        lines: [{ merchandiseId, quantity }],
      },
    });
    return data.cartLinesAdd.cart;
  } else {
    const data = await shopifyFetch({
      query: CREATE_CART_MUTATION,
      variables: {
        lines: [{ merchandiseId, quantity }],
      },
    });
    const newCart = data.cartCreate.cart;
    localStorage.setItem('shopify_cart_id', newCart.id);
    return newCart;
  }
}


// Sign Up Mutation
export const customerCreateMutation = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Sign In Mutation (Generates the Access Token)
export const customerAccessTokenCreateMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;