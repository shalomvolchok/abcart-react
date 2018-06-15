import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectDeleteStripeCard } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow, mount } = Enzyme;

describe("Save stripe cart test", () => {
    const DeleteCard = ({ deleteCard }) => (
        <form
            onSubmit={e => {
                e.preventDefault();
                deleteCard("my-token");
            }}
        />
    );

    const Root = connectDeleteStripeCard(DeleteCard);

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
            deleteCard: expect.any(Function),
            status: { status: "idle" }
        });
    });

    it("Passes status updates to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        updatePaymentMethod: {
                            status: "error",
                            message: "Some error"
                        }
                    }),
                    actions: { updatePaymentMethod: jest.fn() }
                }
            }
        });

        expect(wrapper.props()).toEqual({
            deleteCard: expect.any(Function),
            status: {
                status: "error",
                message: "Some error"
            }
        });
    });

    it("Calls abcart to delete token", () => {
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

        expect(updatePaymentMethod.mock.calls[0]).toEqual(["my-token", true]);
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
