import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../layout/Header';
import ceratium from "../../assets/ceratium.jpg";
import ditylum from "../../assets/ditylum-gradient.png";
import chaetoceros from "../../assets/chaetoceros-gradient.png";
import lithodesmium from "../../assets/lithodesmium-gradient.png";

export class Landing extends Component {
    // TODO: Make hero into img and add alt text
    // media query smaller version when width is less than 950px

    static propTypes = {
        onHome: PropTypes.bool,
        onClassify: PropTypes.bool,
        onLearn: PropTypes.bool,
        onNotebook: PropTypes.bool,
        onAnalysis: PropTypes.bool,
      };

    render() {

        if(this.props.onClassify) {
            return <Redirect to="/classify" />
        }
        if(this.props.onHome) {
            return <Redirect to="/" />
        }
        if(this.props.onNotebook) {
            return <Redirect to="/notebook/" />
        }
        if(this.props.onAnalysis) {
            return <Redirect to="/analysis/" />
        }

        return (
            <main>
                <Header location={this.props.location} />
                <div style={{'background-color':'#7bb224'}}>
                    <div className='learn-hero'>
                        <h2 className='learn-title'>Learn</h2>
                    </div>
                </div>
                <div className='main'>
                    <div className='learn-page'>
                        <h3 className='learn-heading'>Phytoplankton</h3>
                        <br/>
                        <p className='learn-body'>Phytoplankton are tiny, single-celled organisms that drift with the ocean currents. Like plants, many species of phytoplankton convert sunlight to energy through photosynthesis, though some types can consume prey.</p>
                        <h3 className='learn-heading'>IFCBs</h3>
                        <br/>
                        <p className='learn-body'>The phytoplankton images on this site are taken by an Imaging FlowCytobot, or IFCB. An IFCB is an automated microscope with a built-in camera. It collects a small sample of seawater, which flows through a tiny tube inside the instrument. Images of the phytoplankton cells are taken as they pass one at a time in front of the camera. <br/><br/> The IFCB is a valuable tool because it runs by itself, around the clock, for weeks at a time. The IFCB collects a seawater sample every 20 minutes, and can produce as many as 20,000 images an hour! All of the images are sent over the internet to a computer.</p>
                        <h3 className='learn-heading'>The Lab</h3>
                        <br/>
                        <p className='learn-body'>In the Kudela Lab at UC Santa Cruz, we use microscopes, satellites, robots, and good old fashioned chemistry to understand phytoplankton. Phytoplankton are the unsung heroes of our planet, providing food for everything from krill to whales, and producing much of the oxygen in our atmosphere. The dynamic and ever-changing phytoplankton community is made up of thousands of different species, and we use an array of tools to examine what kinds are in the water at different times and under different conditions. This</p>
                    </div>
                </div>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    onClassify: state.menu.onClassify,
    onHome: state.menu.onHome,
    onNotebook: state.menu.onNotebook,
    onAnalysis: state.menu.onAnalysis,
 });

 export default connect(mapStateToProps)(Landing);