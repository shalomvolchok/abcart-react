import React from "react";
import PropTypes from "prop-types";

export default WrappedComponent =>
    class SubmitFormHOC extends React.Component {
        static contextTypes = {
            abCloudCart: PropTypes.object
        };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    saveForm={this.context.abCloudCart.actions.saveForm}
                />
            );
        }
    };
