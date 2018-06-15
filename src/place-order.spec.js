import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectPlaceOrder } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow, mount } = Enzyme;

describe("Place Order", () => {
    it("Gives expected props to wrapped component", () => {
        const Root = connectPlaceOrder(() => <div />);

        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        pendingOrderId: "1234"
                    }),
                    actions: {
                        stripePayForOrder: () => {}
                    }
                }
            }
        });
        expect(wrapper.props()).toEqual({
            status: { status: "ready" },
            placeOrder: expect.any(Function)
        });
    });

    it("Set's status to noPendingOrder if there is no pendingOrderId", () => {
        const Root = connectPlaceOrder(() => <div />);

        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({}),
                    actions: {
                        stripePayForOrder: () => {}
                    }
                }
            }
        });
        expect(wrapper.props()).toEqual({
            status: { status: "noPendingOrder" },
            placeOrder: expect.any(Function)
        });
    });

    it("Calls abcart when placing an order", () => {
        const Root = connectPlaceOrder(({ placeOrder }) => (
            <div
                onClick={() =>
                    placeOrder({ source: "tok_123", isNewCard: true })
                }
            />
        ));

        const stripePayForOrder = jest.fn();
        const wrapper = mount(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        pendingOrderId: "1234"
                    }),
                    actions: {
                        stripePayForOrder
                    }
                }
            }
        });

        wrapper.find("div").simulate("click");
        expect(stripePayForOrder.mock.calls[0]).toEqual([
            "1234",
            "tok_123",
            true
        ]);
    });

    it("Passes status updates to wrapped component", () => {
        const Root = connectPlaceOrder(() => <div />);

        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        stripePayForOrder: {
                            status: "error",
                            message: "There is an error."
                        }
                    }),
                    actions: {
                        stripePayForOrder: () => {}
                    }
                }
            }
        });
        expect(wrapper.props()).toEqual({
            status: {
                status: "error",
                message: "There is an error."
            },
            placeOrder: expect.any(Function)
        });
    });

    it("Calls unsubscribe on unmount", () => {
        const Root = connectPlaceOrder(() => <div />);

        const stripePayForOrder = jest.fn();
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
                    actions: { stripePayForOrder }
                }
            }
        });
        expect(unsubscribe).not.toBeCalled();
        wrapper.unmount();
        expect(unsubscribe).toBeCalled();
    });
});
