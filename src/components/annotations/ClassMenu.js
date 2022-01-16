import React from "react";
import '../../css/classify-styles.css';

class Micrometer extends React.Component {
    render() {
        return(
            <div className="drag-box">
                <div className="micrometer-block"
                style={{width: (String(34*this.props.scale) + 'vw')}}></div>
                <p className="micrometer-text">10µm</p>
            </div>
        );
    }
}

class ClassMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indexSelected: 0,
        }
    }
    
    handleMenuClick(x, i) {
        this.setState({ indexSelected: i })
        this.props.onClick(x)
    }
  
    render() {
      const options = this.props.classes.map((x, i) => 
      <li key={x}><button id={x} onClick={() => this.handleMenuClick(x, i)}>{x}</button></li>);

      return(
      <div className="sidebar">
      <div style={{'display':'flex'}}>
            <div className={this.props.showPhytoGuide ? "class-menu with-guide" : "class-menu"}>
                <div className="control-box">
                    <div className="annotation-control" onClick={() =>  this.props.handleSelectAllClick()}>
                        <p className="control-text">Select All</p>
                    </div>
                    <div className="annotation-control" onClick={() =>  this.props.handleUndoClick()}>
                        <p className="control-text">Undo</p>
                    </div>
                </div>
                <ul className="class-menu-options">{options}</ul>
            </div>
            {this.props.showPhytoGuide ? 
                    <div className="phyto-guide">
                        <p className="phyto-guide-heading">{this.props.classes[this.state.indexSelected]}</p>
                        <p className="phyto-guide-description">{this.props.descriptions[this.state.indexSelected]}</p>
                        <div className="yes-examples">
                            { (this.props.examples.length > 0) ?
                                this.props.examples[this.state.indexSelected].map((image) => (
                                    <img src={image} className="image" 
                                        alt={this.props.classes[this.state.indexSelected] + ' example'}
                                        className="phyto-guide-image"
                                        >
                                    </img>
                                )) : <div></div>
                            }
                        </div>
                        <div className="no-examples">
                            { (this.props.nonexamples.length) > 0 ? ((this.props.nonexamples[this.state.indexSelected].length) ? <p className="phyto-guide-nonexample-heading">Don't confuse with:</p> : <div></div>) : <div></div> }
                            { (this.props.nonexamples.length) > 0 ? 
                                this.props.nonexamples[this.state.indexSelected].map((image) => (
                                    <img src={image} className="image" 
                                        alt={this.props.classes[this.state.indexSelected] + ' non-example'}
                                        className="phyto-guide-image"
                                        >
                                    </img>
                                )) : <div></div>
                            }
                        </div>
                    </div> : <div></div>}
      </div>
      <Micrometer scale={this.props.scale}/>
      </div>
      );
  }
}

export default ClassMenu