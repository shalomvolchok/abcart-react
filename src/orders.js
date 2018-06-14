import React from "react";
import PropTypes from "prop-types";

export default WrappedComponent =>
    class hocOrders extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        constructor(props, context) {
            super(props, context);
            this.state = {
                orders: [],
                pendingOrderId: ""
            };
        }

        componentDidMount() {
            const { abCloudCart } = this.context;
            this.subscription = abCloudCart.store
                .map(store => {
                    return {
                        orders: store.orders || [],
                        pendingOrderId: store.pendingOrderId
                    };
                })
                .subscribe({
                    next: storeState => {
                        this.setState(storeState);
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
                    orders={this.state.orders}
                    pendingOrderId={this.state.pendingOrderId}
                />
            );
        }
    };
