import React, { Component } from "react";
import axios from "axios";

class PlanktonImage extends React.Component {

  render() {
  const url = this.props.nameSpace + this.props.timestamp + '_' + this.props.ifcb + '_' + this.props.targetNum + '.jpg';
      return(
          <img src={url} className="image" alt={this.props.classification} id={this.props.targetNum + '-image'}></img>
      );
  }
}

class Plankton extends React.Component {
  
  renderImage() {
      return (
      <div>
          <PlanktonImage 
              nameSpace={this.props.nameSpace}
              timestamp={this.props.timestamp}
              ifcb={this.props.ifcb}
              targetNum={this.props.targetNum}
              classification={this.props.classification}
          />
      </div>
      );
  }

  render() {
      return(
          <button className="plankton-button" onClick={() => this.props.onClick(this.props.id)}>
              <div className="plankton">
                  {this.renderImage()}
                  <div className="id" id={this.props.targetNum}>
                      <p className="id-text" id={this.props.targetNum + '_text'}>{this.props.classification}</p>
                  </div>
              </div>
          </button>
      );
  }
}

class ClassMenu extends React.Component {
  render() {
      const options = this.props.classes.map((x) => 
      <li key={x}><button id={x} onClick={() => this.props.onClick(x)}>{x}</button></li>);
      return(
      <div className="class-menu">
          <ul>{options}</ul>
      </div>
      );
  }
}

class Annotations extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          classes: [ // change options to be admin defined later (likely with Django)
              'Akashiwo', 
              'Alexandrium Singlet', 
              'AmyGonyProtoc', 
              'Asterionellopsis',
              'Centric',
              'Ceratium',
              'Chaetoceros',
              'Cochlodinium',
              'Cryptophyte, NanoP Less10, Small Misc',
              'CylNitz',
              'DetCerLau',
              'Dictyocha',
              'Dinophysis',
              'Eucampia',
              'GuinDact',
              'Gymnodinium, Peridinium',
              'Lingulodinium',
              'Pennate',
              'Prorocentrum',
              'Pseudo-Nitzschia',
              'Scrip Het',
              'Skeletonema',
              'Thalassionema',
              'Thalassiosira',
              'Unclassified'
          ],
          classPicker: 'Unclassified',
          nameSpace: 'http://128.114.25.154:8888/IFCB104/', // change to dynamic on backend
          timestamp: 'D20210612T212626',
          ifcb: 'IFCB104',
          bin: [
              {id: 0, number: '00201', classification: null},
              {id: 1, number: '00202', classification: null},
              {id: 2, number: '00203', classification: null},
              {id: 3, number: '00204', classification: null},
          ],
          rows: [
              ['00201', '00202', '00203', '00204', '00205', '00206'], 
              ['00207', '00208', '00209', '00210', '00211', '00212'], 
              ['00213', '00214', '00215', '00216', '00217', '00218'],
              ['00219', '00220', '00221', '00222', '00223', '00224'],
              ['00225', '00226', '00227', '00228', '00229', '00230'],
              ['00231', '00232', '00233', '00234', '00235', '00236'],
          ],

          rowSpacing: [],

          // change to pull images from data base and dynamically create keys with all null values
          // use height and width of each image to calculate row (based on flexbox width) on backend
      }
  }
  
  handlePlanktonClick(i) {
      const bin = this.state.bin;
      bin[i].classification = this.state.classPicker;
      this.setState({bin: bin});
      const container = document.getElementById(bin[i].number);
      const text = document.getElementById(bin[i].number+'_text');
      container.style.backgroundColor = '#16609F';
      text.style.color = '#FFFFFF';
  }

  handleMenuClick(name) {
      // Fix hover later
      // Getting error when doing lots of reclassifications? Fix later
      const prev = document.getElementById(this.state.classPicker);
      prev.style.backgroundColor = '#079CCC';
      this.state.classPicker = name;
      const btn = document.getElementById(name);
      btn.style.backgroundColor = '#16609F';

      const ids = document.getElementsByClassName('id');
      const idTexts = document.getElementsByClassName('id-text');
      for (let i=0; i<ids.length; i++) {
          if (ids[i].style.backgroundColor !== '#FFFFFF') {
              ids[i].style.backgroundColor = '#FFFFFF';
              idTexts[i].style.color = '#4E4E4E';
          }
      }
      
      for (const target of this.state.bin) {
          if (target.classification === name) {
              const container = document.getElementById(target.id);
              const text = document.getElementById(target.id+'_text');
              container.style.backgroundColor = '#16609F';
              text.style.color = '#FFFFFF';
          }
      }
  }

  /* Fix this entire function later (will need updates to bin and row calls)
  handleRowClick(row) {
      for (const sample of this.state.rows[row]) {
          this.state.bin[sample] = this.state.classPicker;
          const container = document.getElementById(sample);
          const text = document.getElementById(sample+'_text');
          container.style.backgroundColor = '#16609F';
          text.style.color = '#FFFFFF';
      }
      this.setState({bin: this.state.bin});
  }
  */

  handleSelectAllClick() {
      const bin = this.state.bin;
      for (let i = 0; i < bin.length; i++) {
          bin[i].classification = this.state.classPicker;
          const container = document.getElementById(bin[i].number);
          const text = document.getElementById(bin[i].number+'_text');
          container.style.backgroundColor = '#16609F';
          text.style.color = '#FFFFFF';
      }
      this.setState({bin: bin});
  }
  
  renderPlankton(i) {
      return (
          <Plankton 
              nameSpace={this.state.nameSpace}
              timestamp={this.state.timestamp}
              ifcb={this.state.ifcb}
              id={i}
              targetNum={this.state.bin[i].number}
              classification={this.state.bin[i].classification}
              onClick={(i) => this.handlePlanktonClick(i)}
          />
      );
  }

  renderClassMenu() {
      return <ClassMenu 
          classes={this.state.classes}
          onClick={(name) => this.handleMenuClick(name)}
      />;
  }

  render() {
      return(
      <div className="annotations">
          {this.renderClassMenu()}
          <div>
              <div className="control-box">
                  <div className="annotation-control" onClick={() =>  this.handleSelectAllClick()}>
                      <img className="select-all" src="icons/select-white.png"></img>
                      <p className="control-text">Select All</p>
                  </div>
                  <div className="annotation-control" onClick={() =>  this.handleSelectAllClick()}>
                      <p className="control-text">Undo</p>
                  </div>
              </div>
              <div className="image-grid">
                  {this.state.bin.map((target) => this.renderPlankton(target.id))}
              </div>
          </div>
      </div>
      );
  }
}

export default Annotations;