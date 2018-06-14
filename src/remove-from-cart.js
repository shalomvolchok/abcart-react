import React from "react";
import PropTypes from "prop-types";

export default WrappedComponent =>
    class AddToCartHOC extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        removeFromCart = sku => {
            this.context.abCloudCart.actions.updateCartItem(sku, 0);
        };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    removeFromCart={this.removeFromCart}
                />
            );
        }
    };
