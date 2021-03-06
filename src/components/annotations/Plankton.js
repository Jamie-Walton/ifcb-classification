import React from "react";
import BinNote from './BinNote';

import '../../css/classify-styles.css';

class PlanktonImage extends React.Component {

    render() {
    const url = this.props.nameSpace + this.props.timestamp + '_' + this.props.ifcb + '_' + this.props.targetNum + '.jpg';
        return(
            <img src={url} className={"image " + this.props.status} 
            alt={this.props.classification} 
            id={this.props.targetNum + '-image'}
            style={{height: String(Number(this.props.height)*this.props.scale)+'vw'}}></img>
        );
    }
  }

class Plankton extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
        checkStatus: '',
        infoStatus: '',
        imageStatus: '',
        infoButtonStatus: '',
      }
    }

    renderImage() {  
      return (
          <PlanktonImage 
              nameSpace={'http://akashiwo.oceandatacenter.ucsc.edu:8000/data/'}
              timestamp={this.props.timestamp}
              timeseries={this.props.timeseries}
              ifcb={this.props.ifcb}
              targetNum={this.props.targetNum}
              classification={this.props.class_name}
              height={this.props.height}
              scale={this.props.scale}
              status={this.state.imageStatus}
          />
        );
    }
  
    getHeight() {
      if (this.props.height < 0) {
        return '5'
      } else {
          return String((Number(this.props.height) * this.props.scale) + 2.25)
      }
    }
  
    getWidth() {
      if (this.props.width < 0) {
        return '5'
      } else {
          return String(Number(this.props.width)*this.props.scale)
      }
    }
  
    handleInfoClick() {
      this.props.infoChange(this.props.targetNum, false, true);
      (this.state.infoStatus === '') ? this.setState({ infoStatus: 'show-info' }) : this.setState({ infoStatus: '' });
      (this.state.imageStatus === '') ? this.setState({ imageStatus: 'hide' }) : this.setState({ imageStatus: '' });
    }

    onCheck(targetNum) {
      (this.state.checkStatus === '') ? this.setState({ checkStatus: 'checked' }) : this.setState({ checkStatus: '' });
      this.props.onCheck(targetNum);
    }
  
    render() {
      const infoStyle = {
          height: this.getHeight() + 'vw',
          width: this.getWidth() + 'vw'
      };
      
      return(
            <div>
              <div className="plankton-button" 
                id="plankton-button" 
                onClick={this.props.categorizeMode ? 
                  () => this.onCheck(this.props.targetNum) : 
                  () => this.props.onClick(this.props.targetNum)}>
                  <div className="plankton">
                      {this.renderImage()}
                      <div className={this.props.public ? "hide" : "info " + this.props.infoButtonStatus} onMouseEnter={() => this.props.infoChange(this.props.targetNum, false, false)} 
                          onMouseLeave={() => this.props.infoChange(this.props.targetNum, true, false)}
                          onClick={() => this.handleInfoClick()}></div>
                      <div className={"info-div " + this.state.infoStatus} id={this.props.targetNum + '-info'} style={infoStyle}>
                          <p className="classification-info">{this.props.class_name}</p>
                          <p className="target-num-info">{'Target ' + this.props.targetNum}</p>
                          <p className="editor-info">{'Classified by ' + this.props.editor + ',\n' + this.props.date}</p>
                          {(this.props.infoShowing.includes(this.props.targetNum) && this.props.noteOption) ? 
                          <BinNote
                              timeseries={this.props.timeseries}
                              ifcb={this.props.ifcb}
                              file={this.props.file}
                              type='target'
                              image={this.props.targetNum}
                          /> :
                          <div></div>
                          }
                      </div>
                      <div className={this.props.categorizeMode ? 'id public-id' : 'id ' + this.state.imageStatus} id={this.props.targetNum}>
                        {this.props.categorizeMode ?  
                          <div className={'plankton-check ' + this.state.checkStatus} id={this.props.targetNum + '-check'}></div> :
                          <p className='id-text' id={this.props.targetNum + '-text'}>{this.props.class_abbr}</p>
                        }
                      </div>
                  </div>
              </div>
            </div>
        );
    }
  }

export default (Plankton);