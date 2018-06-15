import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectUpdateCartItem } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow, mount } = Enzyme;

describe("Add / Update item in cart", () => {
    it("Gives expected props to wrapped component", () => {
        const Root = connectUpdateCartItem(() => <div />);

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
            updateCartItem: expect.any(Function)
        });
    });

    it("Calls abcart when updating/adding an item", () => {
        const Root = connectUpdateCartItem(({ updateCartItem }) => (
            <div
                onClick={() =>
                    updateCartItem({
                        quantity: 5,
                        sku: "1231",
                        metadata: { name: "Great Product" }
                    })
                }
            />
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
        expect(updateCartItem.mock.calls[0]).toEqual([
            "1231",
            5,
            { name: "Great Product" }
        ]);
    });
});
