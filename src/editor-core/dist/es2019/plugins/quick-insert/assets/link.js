import React from 'react';
export default function IconLink({
  label = ''
}) {
  return /*#__PURE__*/React.createElement("svg", {
    "aria-label": label,
    width: 40,
    height: 40
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    fillRule: "evenodd"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#FFF",
    d: "M0 0h40v40H0z"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(5 12)"
  }, /*#__PURE__*/React.createElement("rect", {
    fill: "#DEEBFF",
    width: 30,
    height: 16,
    rx: 8
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.097 4.435c1.972.018 3.755 1.465 3.971 3.429A3.714 3.714 0 0119.344 12l-3.316-.03c-2.08-.02-3.797-1.736-3.816-3.816L12.2 6.888l1.672.015.011 1.266a2.156 2.156 0 002.13 2.13l3.315.03a2.07 2.07 0 002.079-2.313c-.122-1.099-1.137-1.9-2.24-1.91l-1.125-.01a.853.853 0 01-.843-.843.817.817 0 01.828-.828l1.07.01zm-9.103 7.13c-1.972-.018-3.754-1.465-3.97-3.429A3.714 3.714 0 019.747 4l3.316.03c2.08.02 3.796 1.736 3.816 3.816l.011 1.266-1.671-.015-.012-1.266A2.156 2.156 0 0013.08 5.7l-3.316-.03a2.07 2.07 0 00-2.078 2.313c.122 1.099 1.137 1.9 2.24 1.91l1.125.01c.461.004.84.382.843.843a.817.817 0 01-.828.828l-1.07-.01z",
    fill: "#0052CC"
  }))));
}