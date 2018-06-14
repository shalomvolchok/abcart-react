import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectSaveStripeCard } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow, mount } = Enzyme;

describe("Save stripe cart test", () => {
    const AddCard = ({ saveCardToken }) => (
        <form
            onSubmit={e => {
                e.preventDefault();
                saveCardToken("my-token");
            }}
        />
    );

    const Root = connectSaveStripeCard(AddCard);

    it("Gives expected props to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({}),
                    // you should create a uuid, we could expose such a function from this library,
                    // so you can keep track of its status however you would like
                    actions: { updatePaymentMethod: jest.fn() }
                }
            }
        });
        expect(wrapper.props()).toEqual({
            saveCardToken: expect.any(Function),
            status: { status: "idle" }
        });
    });

    it("Passes 'error' to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        updatePaymentMethod: {
                            status: "error",
                            message: "It's an error!"
                        }
                    }),
                    actions: { updatePaymentMethod: jest.fn() }
                }
            }
        });

        expect(wrapper.props()).toEqual({
            saveCardToken: expect.any(Function),
            status: { message: "It's an error!", status: "error" }
        });
    });

    it("Calls abcart to save token", () => {
        const updatePaymentMethod = jest.fn();
        const wrapper = mount(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({}),
                    actions: { updatePaymentMethod }
                }
            }
        });

        wrapper.find("form").simulate("submit");

        expect(updatePaymentMethod.mock.calls[0][0]).toBe("my-token");
    });

    it("Calls unsubscribe on unmount", () => {
        const updatePaymentMethod = jest.fn();
        const unsubscribe = jest.fn();
        const wrapper = mount(<Root />, {
            context: {
                abCloudCart: {
                    store: {
                        map: () => ({
                            subscribe: () => {
                                return { unsubscribe };
                            }
                        })
                    },
                    actions: { updatePaymentMethod }
                }
            }
        });
        expect(unsubscribe).not.toBeCalled();
        wrapper.unmount();
        expect(unsubscribe).toBeCalled();
    });
});
