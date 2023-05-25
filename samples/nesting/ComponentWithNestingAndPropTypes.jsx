import PropTypes from "prop-types";

export const Component = (prop) => {
  return <div />;
};

Component.propTypes = {
  propObject: PropTypes.shape({
    propObject: PropTypes.shape({
      propString: PropTypes.shape({
        propString: PropTypes.string,
        propBoolean: PropTypes.bool,
      }),
    }),
  }),
};
