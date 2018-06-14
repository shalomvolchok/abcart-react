import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectShippingAddress } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");
jest.mock("uuid/v4", () => jest.fn(() => "mock-uuid"));

const { shallow, mount } = Enzyme;

describe("Shipping Address", () => {
    const Root = connectShippingAddress(() => <div />);

    it("Gives expected props to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        addresses: [{ id: "2342", name: "John Smith" }],
                        selectedAddressId: "12345"
                    }),
                    actions: {
                        updateAddress: () => {}
                    }
                }
            }
        });
        expect(wrapper.props()).toEqual({
            addresses: [{ id: "2342", name: "John Smith" }],
            selectAddress: expect.any(Function),
            selectedAddressId: "12345",
            saveNewAddress: expect.any(Function),
            updateShippingAddress: expect.any(Function),
            status: { status: "idle" },
            calculateShippingMethods: expect.any(Function)
        });
    });

    it("Calls abcart when selecting shipping address", () => {
        const Root = connectShippingAddress(({ selectAddress }) => (
            <div onClick={() => selectAddress("2342")} />
        ));

        const updateAddress = jest.fn();
        const wrapper = mount(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        addresses: [{ id: "2342", name: "John Smith" }],
                        selectedShippingAddress: ""
                    }),
                    actions: {
                        updateAddress
                    }
                }
            }
        });

        wrapper.find("div").simulate("click");
        expect(updateAddress.mock.calls[0]).toEqual([
            "2342",
            { id: "2342", name: "John Smith" },
            true
        ]);
    });

    it("Calls abcart when saving a new address", () => {
        const Root = connectShippingAddress(({ saveNewAddress }) => (
            <div
                onClick={() =>
                    saveNewAddress(
                        {
                            name: "Bob Jones",
                            line1: "128 South Bend"
                        },
                        true
                    )
                }
            />
        ));

        const updateAddress = jest.fn();
        const wrapper = mount(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        addresses: [{ id: "2342", name: "John Smith" }],
                        selectedShippingAddress: ""
                    }),
                    actions: {
                        updateAddress
                    }
                }
            }
        });

        wrapper.find("div").simulate("click");
        expect(updateAddress.mock.calls[0]).toEqual([
            "mock-uuid",
            {
                name: "Bob Jones",
                line1: "128 South Bend"
            },
            true
        ]);
    });

    it("Calls abcart when updating an address", () => {
        const Root = connectShippingAddress(({ updateShippingAddress }) => (
            <div
                onClick={() =>
                    updateShippingAddress(
                        "2342",
                        {
                            name: "John Smith",
                            line1: "222 South Bend",
                            city: "Boston"
                        },
                        true
                    )
                }
            />
        ));

        const updateAddress = jest.fn();
        const wrapper = mount(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        addresses: [{ id: "2342", name: "John Smith" }],
                        selectedShippingAddress: ""
                    }),
                    actions: {
                        updateAddress
                    }
                }
            }
        });

        wrapper.find("div").simulate("click");
        expect(updateAddress.mock.calls[0]).toEqual([
            "2342",
            {
                name: "John Smith",
                line1: "222 South Bend",
                city: "Boston"
            },
            true
        ]);
    });

    it("Passes status updates to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        updateAddress: {
                            status: "error",
                            message: "Some error"
                        }
                    }),
                    actions: { updateAddress: jest.fn() }
                }
            }
        });

        expect(wrapper.props()).toEqual({
            addresses: [],
            selectAddress: expect.any(Function),
            selectedAddressId: "",
            saveNewAddress: expect.any(Function),
            updateShippingAddress: expect.any(Function),
            status: {
                status: "error",
                message: "Some error"
            },
            calculateShippingMethods: expect.any(Function)
        });
    });

    it("Calls unsubscribe on unmount", () => {
        const unsubscribe = jest.fn();
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: {
                        map: () => ({
                            subscribe: () => {
                                return { unsubscribe };
                            }
                        })
                    },
                    actions: {}
                }
            }
        });
        expect(unsubscribe).not.toBeCalled();
        wrapper.unmount();
        expect(unsubscribe).toBeCalled();
    });
});
