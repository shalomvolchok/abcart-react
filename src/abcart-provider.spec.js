import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { AbcartProvider } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow } = Enzyme;

describe("Abcart React Provider", () => {
    const abcart = require("abcart");
    const unsubscribe = jest.fn();
    const connectMock = jest.fn(() => ({
        unsubscribe
    }));
    const abcartMock = abcart.mockImplementation(data => {
        return {
            store: {},
            connect: connectMock,
            actions: {}
        };
    });

    const Root = () => (
        <AbcartProvider
            appId="test-app"
            apikey="2349234"
            token={"Fake_api_jwt"}
        >
            <div>Hello world</div>
        </AbcartProvider>
    );

    const wrapper = shallow(<Root />).dive();

    it("Initializes abcart with proper values", () => {
        expect(abcartMock.mock.calls[0][0]).toEqual({
            appId: "test-app",
            apikey: "2349234",
            token: "Fake_api_jwt"
        });
    });

    it("Adds store and actions to context", () => {
        expect(wrapper.instance().getChildContext()).toEqual({
            abCloudCart: { store: {}, actions: {} }
        });
    });

    it("Calls connect() on abcart", () => {
        expect(connectMock).toBeCalled();
    });

    it("Renders a child", () => {
        expect(wrapper.contains(<div>Hello world</div>)).toBe(true);
    });

    it("Calls unsubscribe if provider unmounts", () => {
        expect(unsubscribe).not.toBeCalled();
        wrapper.unmount();
        expect(unsubscribe).toBeCalled();
    });
});
