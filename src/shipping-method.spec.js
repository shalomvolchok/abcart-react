import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectShippingMethod } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow, mount } = Enzyme;

describe("Shipping Methods", () => {
    const Root = connectShippingMethod(() => <div />);

    it("Gives expected props to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        orders: [
                            {
                                id: "or_123",
                                selected_shipping_method: "ship_1",
                                shipping_methods: [
                                    {
                                        id: "ship_1",
                                        amount: 999,
                                        currency: "usd",
                                        delivery_estimate: null,
                                        description: "Ground Shipping"
                                    },
                                    {
                                        id: "ship_2",
                                        amount: 2499,
                                        currency: "usd",
                                        delivery_estimate: null,
                                        description: "2 Day Shipping"
                                    }
                                ]
                            }
                        ],
                        pendingOrderId: "or_123"
                    }),
                    actions: {
                        selectShippingMethod: () => {}
                    }
                }
            }
        });
        expect(wrapper.props()).toEqual({
            allShippingMethods: [
                {
                    amount: 999,
                    currency: "usd",
                    delivery_estimate: null,
                    description: "Ground Shipping",
                    id: "ship_1"
                },
                {
                    amount: 2499,
                    currency: "usd",
                    delivery_estimate: null,
                    description: "2 Day Shipping",
                    id: "ship_2"
                }
            ],
            chooseShippingMethod: expect.any(Function),
            shippingMethod: "ship_1",
            status: { status: "idle" }
        });
    });

    it("Calls abcart when selecting shipping method", () => {
        const Root = connectShippingMethod(({ chooseShippingMethod }) => (
            <div onClick={() => chooseShippingMethod("22")} />
        ));

        const chooseShippingMethod = jest.fn();
        const wrapper = mount(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        // state must contain a selectedOrderId to choose a shippingMethod
                        pendingOrderId: "or_123"
                    }),
                    actions: {
                        chooseShippingMethod
                    }
                }
            }
        });

        wrapper.find("div").simulate("click");
        expect(chooseShippingMethod.mock.calls[0]).toEqual(["22", "or_123"]);
    });

    it("Passes status updates (errors) to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        chooseShippingMethod: {
                            status: "error",
                            message: "There has been an error."
                        }
                    }),
                    actions: {
                        selectShippingMethod: () => {}
                    }
                }
            }
        });
        expect(wrapper.props()).toEqual({
            allShippingMethods: [],
            chooseShippingMethod: expect.any(Function),
            shippingMethod: undefined,
            status: {
                status: "error",
                message: "There has been an error."
            }
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
