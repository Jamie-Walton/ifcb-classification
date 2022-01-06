import React from "react";
import '../../../css/classify-styles.css';
import dropdown from "../../../icons/dropdown.png";

class TimeSeriesControl extends React.Component {
    handleDropdown() {
        document.getElementById('timeseries_dropdown').classList.toggle('show');
        document.getElementById('timeseries_label').classList.toggle('hide');
        document.getElementById('timeseries_bar').classList.toggle('accommodate-dropdown');
    }
    
    render() {
        const options = this.props.options.map((x) => 
        <li key={x} onClick={() => this.props.onClick(x)}><button id={x}>{x}</button></li>)
        return (
            <div>
                <div className="time time-series" id='timeseries_bar'>
                    <p className="time-selection">{this.props.timeseries}</p>
                    <img src={dropdown} className="time-icon" 
                    alt={'Select time series'} onClick={() => this.handleDropdown()}></img>
                </div>
                <div className="time-dropdown time-series" id='timeseries_dropdown'>
                    <ul className="timeseries-option">{options}</ul>
                </div>
                <p className="time-label" id='timeseries_label'>Time Series</p>
            </div>
        );
    }
}

export default (TimeSeriesControl);