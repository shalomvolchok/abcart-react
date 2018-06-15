import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import mock from "xhr-mock";
import { Observable } from "rxjs";
import { connectSaveForm } from "../src";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("abcart");

const { shallow, mount } = Enzyme;

describe("Save Form", () => {
    it("Gives expected props to wrapped component", () => {
        const Root = connectSaveForm(() => <div />);

        const wrapper = shallow(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({}),
                    actions: {
                        saveForm: () => {}
                    }
                }
            }
        });
        expect(wrapper.props()).toEqual({
            saveForm: expect.any(Function)
        });
    });

    it("Calls abcart when submitting a form", () => {
        const Root = connectSaveForm(({ saveForm }) => (
            <div
                onClick={() =>
                    saveForm({
                        hello: "world"
                    })
                }
            />
        ));

        const saveForm = jest.fn();
        const wrapper = mount(<Root />, {
            context: {
                abCloudCart: {
                    store: Observable.of({}),
                    actions: {
                        saveForm
                    }
                }
            }
        });

        wrapper.find("div").simulate("click");
        expect(saveForm.mock.calls[0][0]).toEqual({
            hello: "world"
        });
    });
});
