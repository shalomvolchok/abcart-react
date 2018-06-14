import React from "react";
import PropTypes from "prop-types";

export default WrappedComponent =>
    class UpdateCartItemHOC extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        updateCartItem = ({ quantity, sku, metadata }) => {
            this.context.abCloudCart.actions.updateCartItem(
                sku,
                quantity,
                metadata
            );
        };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    updateCartItem={this.updateCartItem}
                />
            );
        }
    };
