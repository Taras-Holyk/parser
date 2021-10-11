import React, { Component } from 'react';

class ValidationErrorsList extends Component{
  render() {
    return this.props.errors.map((error, key) => {
      return <div key={key}>{error.detail}</div>;
    });
  }
}

export default ValidationErrorsList;
