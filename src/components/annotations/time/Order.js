import React from "react";
import '../../../css/classify-styles.css';

class Order extends React.Component {  
    render() {
        return(
            <div>
                <div className="set" id={this.props.barID} onClick={() => this.props.onClick(this.props.order)}>
                    <p className="time-selection">{this.props.order}</p>
                </div>
                <p className="time-label" id={this.props.labelID}>{this.props.type}</p>
            </div>
        );
    }
}

export default (Order);