import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectCartItems } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow } = Enzyme;

describe("Cart Items", () => {
    const ShoppingCart = () => <div />;

    const Root = connectCartItems(ShoppingCart);

    it("Gives expected props to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        cart: [{ sku: 1 }, { sku: 2 }]
                    }),
                    actions: {}
                }
            }
        });
        expect(wrapper.props()).toEqual({
            cartItems: [{ sku: 1 }, { sku: 2 }]
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
