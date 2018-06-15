import React from "react";
import PropTypes from "prop-types";

export default WrappedComponent =>
    class hocShippingMethod extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        constructor(props, context) {
            super(props, context);
            this.state = {
                shippingMethod: null,
                allShippingMethods: [],
                status: { status: "idle" }
            };
        }

        componentDidMount() {
            const { abCloudCart } = this.context;
            this.subscription = abCloudCart.store
                .map(store => {
                    const pendingOrder =
                        (store.orders || []).find(
                            order => order.id === store.pendingOrderId
                        ) || {};
                    return {
                        allShippingMethods: pendingOrder.shipping_methods || [],
                        shippingMethod: pendingOrder.selected_shipping_method,
                        status: store.chooseShippingMethod || {
                            status: "idle"
                        },
                        pendingOrderId: store.pendingOrderId
                    };
                })
                .subscribe(state => {
                    this.setState(state);
                });
        }

        componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        chooseShippingMethod = id => {
            if (this.state.pendingOrderId) {
                this.context.abCloudCart.actions.chooseShippingMethod(
                    id,
                    this.state.pendingOrderId
                );
            } else {
                this.setState({
                    status: {
                        status: "error",
                        message:
                            "Must have a pending order to choose shipping method."
                    }
                });
            }
        };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    chooseShippingMethod={this.chooseShippingMethod}
                    shippingMethod={this.state.shippingMethod}
                    allShippingMethods={this.state.allShippingMethods}
                    status={this.state.status}
                />
            );
        }
    };
