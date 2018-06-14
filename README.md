### abcart-react

This repository holds the `abcart-react` SDK. It is build to work with the abcart service as provided by [abcart.io](https://www.abcart.io). The library provides a set of Higher Order Components that provide a full-featured cart, payments, & subscriptions. The abcart service works with your Stripe account and eliminates the need for you to manage your own backend to interface with Stripe's apis.

Full documentation: [abcart.io/documentation](https://www.abcart.io/documentation/getting-your-api-key-and-shared-secret-key).

Example application: [https://github.com/abcloudio/abcart-react-example](https://github.com/abcloudio/abcart-react-example)

##### Installation

`npm install -s react-cart`

##### Quick Start

*   Sign-up for an account at [abcart.io](https://www.abcart.io)

*   Connect your Stripe account, from your abcart account dashboard.

-   Add products and subscriptions to your Stripe account that you would like to charge through the abcart service. https://www.abcart.io/documentation/working-with-products-and-skus-using-stripe

*   Get your `apikey`, `appId`, and `secret` from the abcart dashboard.

*   Create a JSON webtoken signed with your `secret` for each unique user to your website. This passes your users identity to the abcart service. This MUST be done in a secure environment, ideally on your server during each request. https://www.abcart.io/documentation/signing-json-web-tokens

```js
import jwttoken from "jsonwebtoken";
const token = jwttoken.sign(
    {
        appId: "your-app-id",
        // continue sending the userId as it is linked to
        // cart items
        userId: "anonymous-user-id",

        // add loggedInUserId
        loggedInUserId: "your-users-id-from-your-system",

        // email will be associated with Stripe customer
        email: "customers-email",

        // optional, to enable test mode in your Stripe account
        // will work with Stripe test cards and save all data
        // to your Test dashboard in Stripe
        test: true
    },
    "your-secret-key",
    { issuer: "your-app-id" }
);
```

*   Wrap your React application in the `AbcartProvider`, passing it your `apikey` and the signed `JWT` you created on your server.

```js
const JWT = localStorage.get("ABCART_JWT");
const App = () => (
    <AbcartProvider apikey="your-api-key" token={JWT}>
        <YourApp />
    </AbcartProvider>
);
```

*   Use this libraries Higher Order Components to provide your application with `state` and `actions`.

An example add to cart button.

```js
import React from "react";
import { connectUpdateCartItem } from "abcart-react";

const AddToCart = ({ updateCartItem, sku, metadata }) => {
    return (
        <button onClick={() => updateCartItem({ sku, quantity: 1, metadata })}>
            Add To Cart
        </button>
    );
};
AddToCart.PropTypes = {
    sku: PropType.string,
    metadata: PropType.object
};

export default connectUpdateCartItem(AddToCart);
```

An example connecting to the shopping cart items.

```js
import React from "react";
import { connectCartItems } from "abcart-react";

const ShoppingCart = ({ cartItems }) => {
    return (
        <div>
            {cartItems.map(item => (
                <div>
                    {item.sku} | {item.quantity} | {item.metadata.name}
                </div>
            ))}
        </div>
    );
};

export default connectCartItems(ShoppingCart);
```

##### For further examples and documentation see

Full documentation: [abcart.io/documentation](https://www.abcart.io/documentation/getting-your-api-key-and-shared-secret-key).

Example application: [https://github.com/abcloudio/abcart-react-example](https://github.com/abcloudio/abcart-react-example)

##### Development

Install dependencies

```js
npm install
```

Run the tests

```js
npm run test
```
