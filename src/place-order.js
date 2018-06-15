import React from "react";
import PropTypes from "prop-types";

export default WrappedComponent =>
    class hocPlaceOrder extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        constructor(props, context) {
            super(props, context);
            this.state = {
                status: { status: "noPendingOrder" }
            };
        }

        componentDidMount() {
            const { abCloudCart } = this.context;
            this.subscription = abCloudCart.store
                .map(({ pendingOrderId, stripePayForOrder }) => {
                    return {
                        pendingOrderId,
                        status:
                            stripePayForOrder ||
                            (pendingOrderId
                                ? { status: "ready" }
                                : { status: "noPendingOrder" })
                    };
                })
                .subscribe(state => this.setState(state));
        }

        placeOrder = ({ source, isNewCard }) => {
            if (this.state.pendingOrderId) {
                this.context.abCloudCart.actions.stripePayForOrder(
                    this.state.pendingOrderId,
                    source,
                    isNewCard
                );
            } else {
                this.setState({
                    status: {
                        status: "error",
                        message: "There is no pending order to place."
                    }
                });
            }
        };

        componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    placeOrder={this.placeOrder}
                    status={this.state.status}
                />
            );
        }
    };
