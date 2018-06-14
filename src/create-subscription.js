import React from "react";
import PropTypes from "prop-types";

export default WrappedComponent =>
    class hocCreateSubscription extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        constructor(props, context) {
            super(props, context);
            this.state = {
                subscriptions: [],
                status: { status: "idle" }
            };
        }

        componentDidMount() {
            const { abCloudCart } = this.context;
            this.subscription = abCloudCart.store
                .map(({ stripeSubscription, subscriptions }) => {
                    return {
                        subscriptions,
                        status: stripeSubscription || { status: "idle" }
                    };
                })
                .subscribe(state => this.setState(state));
        }

        createSubscription = ({ items, source }) => {
            this.context.abCloudCart.actions.stripeSubscription(items, source);
        };

        componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    createSubscription={this.createSubscription}
                    subscriptions={this.state.subscriptions}
                    status={this.state.status}
                />
            );
        }
    };
