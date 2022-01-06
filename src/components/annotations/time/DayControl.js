import React from "react";
import '../../../css/classify-styles.css';
import dropdown from "../../../icons/dropdown.png";

class DayControl extends React.Component {
    handleDropdown() {
        document.getElementById('day_dropdown').classList.toggle('show');
        document.getElementById('day_label').classList.toggle('hide');
        document.getElementById('day_bar').classList.toggle('accommodate-dropdown');
    }
    
    render() {
        const options = this.props.options.map((x) => 
        <li key={x} onClick={() => this.props.onClick(x)}><button id={x}>{x}</button></li>)
        return(
            <div>
                <div className="time" id='day_bar'>
                    <p className="time-selection" id="day_text">{this.props.day}</p>
                    <img src={dropdown} className="time-icon" 
                    alt={'Select Day'} onClick={() => this.handleDropdown()}></img>
                </div>
                <div className="time-dropdown" id='day_dropdown'>
                    <ul className="year-option">{options}</ul>
                </div>
                <p className="time-label" id='day_label'>Day</p>
            </div>
        );
    }
}

export default (DayControl);