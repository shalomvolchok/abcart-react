import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";

export default WrappedComponent =>
    class hocShippingAddress extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        constructor(props, context) {
            super(props, context);
            this.state = {
                addresses: [],
                selectedAddressId: "",
                status: { status: "idle" }
            };
        }

        componentDidMount() {
            const { abCloudCart } = this.context;
            this.subscription = abCloudCart.store
                .map(store => ({
                    selectedAddressId: store.selectedAddressId || "",
                    addresses: store.addresses || [],
                    status: store.updateAddress ||
                        store.calculateShippingMethods || { status: "idle" }
                }))
                .subscribe({
                    next: nextState => {
                        this.setState(nextState);
                    }
                });
        }

        componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        selectShippingAddress = id => {
            const address = this.state.addresses.find(item => item.id === id);
            this.context.abCloudCart.actions.updateAddress(id, address, true);
        };

        saveNewAddress = (address, isSelected) => {
            // create a new id
            const id = uuid();
            this.context.abCloudCart.actions.updateAddress(
                id,
                address,
                isSelected
            );
        };

        updateShippingAddress = (id, address, isSelected) => {
            this.context.abCloudCart.actions.updateAddress(
                id,
                address,
                isSelected
            );
        };

        calculateShippingMethods = ({
            id,
            address,
            isSelected,
            isNewAddress
        }) => {
            this.context.abCloudCart.actions.calculateShippingMethods(
                // if it's a new address, then create a new id
                isNewAddress ? uuid() : id,
                address,
                isSelected,
                isNewAddress
            );
        };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    addresses={this.state.addresses}
                    selectAddress={this.selectShippingAddress}
                    selectedAddressId={this.state.selectedAddressId}
                    saveNewAddress={this.saveNewAddress}
                    updateShippingAddress={this.updateShippingAddress}
                    calculateShippingMethods={this.calculateShippingMethods}
                    status={this.state.status}
                />
            );
        }
    };
