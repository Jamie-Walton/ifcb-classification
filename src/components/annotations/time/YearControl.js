import React from "react";
import '../../../css/classify-styles.css';
import dropdown from "../../../icons/dropdown.png";

class YearControl extends React.Component {
    handleDropdown() {
        document.getElementById('year_dropdown').classList.toggle('show');
        document.getElementById('year_label').classList.toggle('hide');
        document.getElementById('year_bar').classList.toggle('accommodate-dropdown');
    }
    
    render() {
        const options = this.props.options.map((x) => 
        <li key={x} onClick={() => this.props.onClick(x)}><button id={x}>{x}</button></li>)
        return(
            <div>
                <div className="time" id='year_bar'>
                    <p className="time-selection">{this.props.year}</p>
                    <img src={dropdown} className="time-icon" 
                    alt={'Select Year'} onClick={() => this.handleDropdown()}></img>
                </div>
                <div className="time-dropdown" id='year_dropdown'>
                    <ul className="year-option">{options}</ul>
                </div>
                <p className="time-label" id='year_label'>Year</p>
            </div>
        );
    }
}

export default (YearControl);