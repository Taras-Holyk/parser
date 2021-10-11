import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import ApiService from './../../services/Api';
import './Dashboard.scss';
import 'react-datepicker/dist/react-datepicker.css';
import TableRow from './TableRow/TableRow';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exchangeRates: null,
      selectedDate: new Date(),
      maxDate: new Date(),
      processing: false
    }
  }

  fetchData = async () => {
    if (!this.state.processing) {
      this.setState({
        ...this.state,
        processing: true
      });

      const {data} = await ApiService.get(`exchange-rates?date=${this.state.selectedDate}`);
      this.setState({
        ...this.state,
        exchangeRates: data,
        processing: false
      });
    }
  };

  exportPdf = async () => {
    if (!this.state.processing) {
      this.setState({
        ...this.state,
        processing: true
      });

      const {data: {filename}} = await ApiService.get('exchange-rates/export/pdf');
      window.open(filename);

      this.setState({
        ...this.state,
        processing: false
      });
    }
  };

  exportCsv = async () => {
    if (!this.state.processing) {
      this.setState({
        ...this.state,
        processing: true
      });

      const {data: {filename}} = await ApiService.get('exchange-rates/export/csv');
      window.open(filename);

      this.setState({
        ...this.state,
        processing: false
      });
    }
  };

  handleDateChange = (date) => {
    this.setState({
      selectedDate: date
    });
  };

  render() {
    return (
      <div className="dashboard">
        <div className="dashboard__filter-container">
          <DatePicker
            selected={this.state.selectedDate}
            onChange={this.handleDateChange}
            maxDate={this.state.maxDate}
          />
          <button onClick={this.fetchData} disabled={this.state.processing} className="dashboard__get-data">
            {this.state.exchangeRates ? 'Update data' : 'Fetch data'}
          </button>
        </div>
        {
          this.state.exchangeRates &&
          <React.Fragment>
            <table>
              <thead>
                <tr>
                  <th>Курс до гривні</th>
                  <th>
                    Готівковий ринок<br/>
                    <small>Купівля / Продаж</small>
                  </th>
                  <th>НБУ</th>
                  <th>
                    Чорний ринок<br/>
                    <small>Купівля / Продаж</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.exchangeRates.map((currency) => {
                    return <TableRow currency={currency}/>
                  })
                }
              </tbody>
            </table>
            <div className="dashboard__export-container">
              <button onClick={this.exportCsv} disabled={this.state.processing} className="dashboard__export-button">
                Export to csv
              </button>
              <button onClick={this.exportPdf} disabled={this.state.processing} className="dashboard__export-button">
                Export to pdf
              </button>
            </div>
          </React.Fragment>
        }
      </div>
    );
  }
}

export default Dashboard;
