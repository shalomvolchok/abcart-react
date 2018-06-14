/**
 * Digital Optimization Group, LLC
 */
import React from "react";
import PropTypes from "prop-types";

export default WrappedComponent => {
    class hocSaveStripeCardToken extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        constructor(props, context) {
            super(props, context);
            this.state = {
                status: { status: "idle" }
            };
        }

        componentDidMount() {
            // connect to abCloudCart
            const { abCloudCart } = this.context;

            this.subscription = abCloudCart.store
                .map(({ updatePaymentMethod }) => ({
                    status: updatePaymentMethod || { status: "idle" }
                }))
                .subscribe(state => {
                    this.setState(state);
                });
        }

        componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        saveCardToken = source => {
            this.context.abCloudCart.actions.updatePaymentMethod(source);
        };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    status={this.state.status}
                    saveCardToken={this.saveCardToken}
                />
            );
        }
    }

    return hocSaveStripeCardToken;
};
