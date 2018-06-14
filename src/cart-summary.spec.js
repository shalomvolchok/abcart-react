import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectCartSummary } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow } = Enzyme;

describe("Cart Summary", () => {
    const Root = connectCartSummary(() => <div />);

    it("Gives expected props to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        cart: [
                            {
                                sku: "123",
                                quantity: 3,
                                price: 1500
                            },
                            {
                                sku: "234",
                                quantity: 1,
                                price: 2500
                            }
                        ]
                    }),
                    actions: {}
                }
            }
        });
        expect(wrapper.props()).toEqual({
            cartSummary: { total: "70.00", totalItems: 4, uniqueItems: 2 }
        });
    });

    it("Does not include new pending products", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        cart: [
                            {
                                sku: "123",
                                quantity: 3,
                                price: 1500
                            },
                            {
                                sku: "abc-item2",
                                pending: {
                                    updateId:
                                        "0ea81afc-de8b-4560-8ecf-3af0be82f724",
                                    sku: "abc-item2",
                                    quantity: 4,
                                    metadata: {
                                        name: "Fantastic Widget"
                                    },
                                    error: {
                                        code: "resource_missing",
                                        message: "No such sku: abc-item2"
                                    }
                                }
                            }
                        ]
                    }),
                    actions: {}
                }
            }
        });
        expect(wrapper.props()).toEqual({
            cartSummary: { total: "45.00", totalItems: 3, uniqueItems: 1 }
        });
    });

    it("Calls unsubscribe on unmount", () => {
        const saveCardToken = jest.fn();
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
                    actions: { saveCardToken }
                }
            }
        });
        expect(unsubscribe).not.toBeCalled();
        wrapper.unmount();
        expect(unsubscribe).toBeCalled();
    });
});
