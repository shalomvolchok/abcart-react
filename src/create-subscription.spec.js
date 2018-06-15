import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectCreateSubscription } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow, mount } = Enzyme;

describe("Create Subscription", () => {
    const Root = connectCreateSubscription(() => <div />);

    it("Gives expected props to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        subscriptions: [{ id: 1234 }, { id: 564 }]
                    }),
                    actions: {}
                }
            }
        });
        expect(wrapper.props()).toEqual({
            createSubscription: expect.any(Function),
            status: { status: "idle" },
            subscriptions: [{ id: 1234 }, { id: 564 }]
        });
    });

    it("Calls abcart when creating a subscription", () => {
        const Root = connectCreateSubscription(({ createSubscription }) => (
            <div
                onClick={() =>
                    createSubscription({
                        source: "tok_123",
                        items: [{ plan: "plan_123" }]
                    })
                }
            />
        ));

        const stripeSubscription = jest.fn();
        const wrapper = mount(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({}),
                    actions: {
                        stripeSubscription
                    }
                }
            }
        });

        wrapper.find("div").simulate("click");
        expect(stripeSubscription.mock.calls[0]).toEqual([
            [{ plan: "plan_123" }],
            "tok_123"
        ]);
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
