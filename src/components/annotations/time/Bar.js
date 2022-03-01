import React from "react";
import '../../../css/classify-styles.css';

class Bar extends React.Component {
    handleHover(num) {
        this.props.onHover(num);
    }
    render() {
        return(
            <div className="bar-container">
                <div className="day" id={'day' + this.props.number}>{this.props.day}</div>
                <div className="bar" id={'bar' + this.props.number} 
                    onClick={() => this.props.onClick(this.props.number)}
                    onMouseEnter={() => this.handleHover(this.props.number)}
                    onMouseLeave={() => this.handleHover(this.props.current)}
                    style={{height: String(this.props.height*0.008) + 'vw'}}></div>
            </div>
        );}
  }

  export default (Bar);