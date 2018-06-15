import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectRemoveFromCart } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow, mount } = Enzyme;

describe("Remove from cart", () => {
    it("Gives expected props to wrapped component", () => {
        const Root = connectRemoveFromCart(() => <div />);

        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({}),
                    actions: {
                        updateCartItem: () => {}
                    }
                }
            }
        });
        expect(wrapper.props()).toEqual({
            removeFromCart: expect.any(Function)
        });
    });

    it("Calls abcart when removing an item", () => {
        const Root = connectRemoveFromCart(({ removeFromCart }) => (
            <div onClick={() => removeFromCart("1231")} />
        ));

        const updateCartItem = jest.fn();
        const wrapper = mount(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({}),
                    actions: {
                        updateCartItem
                    }
                }
            }
        });

        wrapper.find("div").simulate("click");
        expect(updateCartItem.mock.calls[0]).toEqual(["1231", 0]);
    });

    // never subscribes to store, no need to unsubscribe
});
