import React, { Component } from 'react';

class TableRow extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.currency.title}</td>
        <td>{this.props.currency.cash.purchase} / {this.props.currency.cash.selling}</td>
        <td>{this.props.currency.nbu}</td>
        <td>{this.props.currency.black.purchase} / {this.props.currency.black.selling}</td>
      </tr>
    );
  }
}

export default TableRow;
