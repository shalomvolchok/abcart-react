import { Component, Children } from "react";
import PropTypes from "prop-types";
import abCloudCart from "abcart";

class ProviderAbCloudCart extends Component {
    getChildContext() {
        return { abCloudCart: this.abCloudCartContext };
    }

    constructor(props, context) {
        super(props, context);
        const { store, actions, connect } = abCloudCart({
            apikey: props.apikey,
            token: props.token
        });
        this.abCloudCartContext = {
            store,
            actions
        };
        // calling connect starts our multicast subject
        // so we can manage the lifecycle of our root websocket
        this.subscription = connect();
        // for testing purposes, will remove
        // setTimeout(() => this.subscription.unsubscribe(), 10000);
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        return Children.only(this.props.children);
    }
}

ProviderAbCloudCart.propTypes = {
    apikey: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired
};

ProviderAbCloudCart.childContextTypes = {
    abCloudCart: PropTypes.object.isRequired
};

ProviderAbCloudCart.displayName = "ProviderAbCloudCart";

export default ProviderAbCloudCart;
