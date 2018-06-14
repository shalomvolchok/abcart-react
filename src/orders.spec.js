import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectOrders } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow } = Enzyme;

describe("Order History", () => {
    const Root = connectOrders(() => <div />);

    it("Gives expected props to wrapped component", () => {
        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({
                        orders: [{ id: 1234 }, { id: 564 }]
                    }),
                    actions: {}
                }
            }
        });
        expect(wrapper.props()).toEqual({
            orders: [{ id: 1234 }, { id: 564 }]
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
