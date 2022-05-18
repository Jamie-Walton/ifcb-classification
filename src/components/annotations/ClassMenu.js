import React from "react";
import '../../css/classify-styles.css';
import correctIcon from "../../icons/green-check.png";
import incorrectIcon from "../../icons/red-x.png";


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
            indexSelected: this.props.initial,
            indexHovered: this.props.initial,
        }
    }
    
    handleMenuClick(x, i) {
        this.setState({ 
            indexSelected: i,
            indexHovered: i,
         });
        this.props.onClick(x);
    }

    handleMouseOver(i) {
        this.setState({ indexHovered: i });
    }

    handleMouseOut() {
        this.setState({ indexHovered: this.state.indexSelected });
    }

    componentDidUpdate(prevProps) {
        if (this.props.initial !== prevProps.initial) {
            this.setState({ 
                indexSelected: this.props.initial,
                indexHovered: this.props.initial,
             });
        }
      }
  
    render() {
      const classes = this.props.categorizeMode ? this.props.categories : this.props.classes
      const descriptions = this.props.categorizeMode ? this.props.descriptions.filter((n,i) => this.props.categoryIndices.includes(i)) : this.props.descriptions
      const examples = this.props.categorizeMode ? this.props.examples.filter((n,i) => this.props.categoryIndices.includes(i)) : this.props.examples
      const nonexamples = this.props.categorizeMode ? this.props.nonexamples.filter((n,i) => this.props.categoryIndices.includes(i)) : this.props.nonexamples
      
      const options = classes.map((x, i) => 
      <li key={x}><button id={x} className="classmenu-button"
            onClick={() => this.handleMenuClick(x, i)} 
            onMouseEnter={() => this.handleMouseOver(i)} 
            onMouseLeave={() => this.handleMouseOut(i)}>{x}</button></li>);


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
                        <p className="phyto-guide-heading">{classes[this.state.indexHovered]}</p>
                        <p className="phyto-guide-description">{descriptions[this.state.indexHovered]}</p>
                        <div className="yes-examples">
                            { (examples.length > 0) ?
                                examples[this.state.indexHovered].map((image) => (
                                    <div>
                                        <img src={correctIcon} className='phyto-guide-icon'></img>
                                        <img src={image} className="image" 
                                            alt={classes[this.state.indexHovered] + ' example'}
                                            className="phyto-guide-image"
                                            >
                                        </img>
                                    </div>
                                )) : <div></div>
                            }
                        </div>
                        <div className="no-examples">
                            { (nonexamples.length) > 0 ? ((nonexamples[this.state.indexHovered].length) ? <p className="phyto-guide-nonexample-heading">Don't confuse with:</p> : <div></div>) : <div></div> }
                            { (nonexamples.length) > 0 ? 
                                nonexamples[this.state.indexHovered].map((image) => (
                                    <div>
                                        <img src={incorrectIcon} className='phyto-guide-icon'></img>
                                        <img src={image} className="image" 
                                            alt={classes[this.state.indexHovered] + ' non-example'}
                                            className="phyto-guide-image"
                                            >
                                        </img>
                                    </div>
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