import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectPaymentMethods } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow, mount } = Enzyme;

describe("Payment Methods", () => {
    const Root = connectPaymentMethods(() => <div />);

    it("Gives expected props to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        paymentMethods: [
                            { id: 7773, lastFour: 2342 },
                            { id: 2, lastFour: 3412 }
                        ]
                    }),
                    actions: {}
                }
            }
        });
        expect(wrapper.props()).toEqual({
            paymentMethods: [
                { id: 7773, lastFour: 2342 },
                { id: 2, lastFour: 3412 }
            ]
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
