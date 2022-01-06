import React from "react";
import '../../../css/classify-styles.css';
import dropdown from "../../../icons/dropdown.png";

class SetControl extends React.Component {
    handleDropdown() {
        document.getElementById('set_dropdown').classList.toggle('show');
        document.getElementById('set_label').classList.toggle('hide');
        document.getElementById('set_bar').classList.toggle('accommodate-dropdown');
    }
    
    render() {
        const classList = this.props.options;
        const options = classList.map((x) => 
        <li key={x} onClick={() => this.props.onClick(x)}><button id={x}>{x}</button></li>)
        return(
            <div>
                <div className="set" id="set_bar">
                <p className="time-selection">{this.props.setDisplay}</p>
                <img src={dropdown} className="time-icon"
                alt={'Select Set'} onClick={() => this.handleDropdown()}></img>
                </div>
                <div className="set-dropdown" id='set_dropdown'>
                    <ul className="set-option">{options}</ul>
                </div>
                <p className="time-label" id="set_label">Set</p>
            </div>
        );
    }
}

export default (SetControl);