import React from "react";
import '../../../css/classify-styles.css';
import dropdown from "../../../icons/dropdown.png";

class FileControl extends React.Component {
    handleDropdown() {
        document.getElementById('file_dropdown').classList.toggle('show');
        document.getElementById('file_label').classList.toggle('hide');
        document.getElementById('file_bar').classList.toggle('accommodate-dropdown');
    }
    
    render() {
        const options = this.props.options.map((x) => 
        <li key={x} onClick={() => this.props.onClick(x)}><button id={x}>{x}</button></li>)
        var fileName = this.props.file;
        const file = fileName.slice(9,12) + ':' + fileName.slice(12,14) + ':' + fileName.slice(14,16) + 'Z';
        return(
            <div>
                <div className="time" id='file_bar'>
                    <p className="time-selection">{file}</p>
                    <img src={dropdown} className="time-icon" 
                    alt={'Select File'} onClick={() => this.handleDropdown()}></img>
                </div>
                <div className="time-dropdown" id='file_dropdown'>
                    <ul className="file-option">{options}</ul>
                </div>
                <p className="time-label" id='file_label'>File</p>
            </div>
        );
    }
}

export default (FileControl);