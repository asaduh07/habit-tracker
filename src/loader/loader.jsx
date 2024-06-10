import Spinner from 'react-spinner-material';
import React, { Component } from 'react';

export default class Loader extends Component {
  render() {
  return (
      <div>
        <Spinner radius={100} color={"#333"} stroke={2} visible={true} />
      </div>
    );
  }
}