import React from "react";
import PropTypes from "prop-types";

export default WrappedComponent =>
    class hocPaymentMethods extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        constructor(props, context) {
            super(props, context);
            this.state = {
                paymentMethods: []
            };
        }

        componentDidMount() {
            const { abCloudCart } = this.context;
            this.subscription = abCloudCart.store
                .map(store => ({
                    paymentMethods: store.paymentMethods
                }))
                .subscribe({
                    next: store => {
                        this.setState(store);
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
                    paymentMethods={this.state.paymentMethods}
                />
            );
        }
    };
