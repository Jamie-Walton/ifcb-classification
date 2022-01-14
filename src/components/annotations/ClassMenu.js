import React from "react";
import '../../css/classify-styles.css';
import phytoGuide from './PhytoGuide';
import Chaetoceros from '../../assets/classify_examples/Chaetoceros/Yes/1.jpg';

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
            classSelected: 'Unclassified',
        }
    }
    
    handleMenuClick(x) {
        this.setState({ classSelected: x })
        this.props.onClick(x)
    }
  
    render() {
      const options = this.props.classes.map((x) => 
      <li key={x}><button id={x} onClick={() => this.handleMenuClick(x)}>{x}</button></li>);
      const guide = phytoGuide.phytoGuide;

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
                        <p className="phyto-guide-heading">{this.state.classSelected}</p>
                        <p className="phyto-guide-description">{guide.Akashiwo.description}</p>
                        <div className="yes-examples">
                            {
                                [...Array(guide.Chaetoceros.yesImages).keys()].map((i) => (
                                    <img src={'http://128.114.25.154:8888/IFCB104/D20161013T081022_IFCB104_00032.jpg'} className="image" 
                                        alt={'Chaetoceros example'}
                                        className="phyto-guide-image"
                                        >
                                    </img>
                                ))
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