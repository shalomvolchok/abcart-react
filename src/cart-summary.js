import React from "react";
import PropTypes from "prop-types";

export default WrappedComponent =>
    class hocCartSummary extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        constructor(props, context) {
            super(props, context);
            this.state = {
                total: 0.0,
                uniqueItems: 0,
                totalItems: 0
            };
        }

        componentDidMount() {
            const { abCloudCart } = this.context;
            this.subscription = abCloudCart.store
                .map(store => {
                    return store.cart
                        .filter(item => item.quantity && item.price)
                        .reduce(
                            (acc, item) => ({
                                total: acc.total + item.price * item.quantity,
                                uniqueItems: acc.uniqueItems + 1,
                                totalItems: acc.totalItems + item.quantity
                            }),
                            {
                                total: 0,
                                uniqueItems: 0,
                                totalItems: 0
                            }
                        );
                })
                .subscribe({
                    next: ({ total, uniqueItems, totalItems }) => {
                        this.setState({
                            cartSummary: {
                                total: (total / 100).toFixed(2),
                                uniqueItems,
                                totalItems
                            }
                        });
                    }
                });
        }

        componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    cartSummary={this.state.cartSummary}
                />
            );
        }
    };
