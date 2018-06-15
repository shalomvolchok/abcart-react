import React from "react";
import PropTypes from "prop-types";

export default WrappedComponent =>
    class hocCartItems extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        constructor(props, context) {
            super(props, context);
            this.state = {
                cartItems: []
            };
        }

        componentDidMount() {
            const { abCloudCart } = this.context;
            this.subscription = abCloudCart.store
                .map((store = {}) => store.cart || [])
                .subscribe(cartItems => {
                    this.setState({
                        cartItems
                    });
                });
        }

        componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    cartItems={this.state.cartItems}
                />
            );
        }
    };
