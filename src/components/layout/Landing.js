import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../layout/Header';
import ifcbGallery from "../../assets/ifcb-gallery.png";
import ditylum from "../../assets/ditylum-gradient.png";
import preview from "../../assets/webpage.png";
import chaetoceros from "../../assets/chaetoceros-gradient.png";
import lithodesmium from "../../assets/lithodesmium-gradient.png";
import centric from "../../assets/centric-gradient.png";
import { goto_learn, goto_classify } from "../../actions/menu";

export class Landing extends Component {
    // TODO: Make hero into img and add alt text
    // media query smaller version when width is less than 950px

    static propTypes = {
        onHome: PropTypes.bool,
        onClassify: PropTypes.bool,
        onLearn: PropTypes.bool,
        onNotebook: PropTypes.bool,
        onAnalysis: PropTypes.bool,
        onRegister: PropTypes.bool,
        onLogin: PropTypes.bool,
        goto_learn: PropTypes.func,
        goto_classify: PropTypes.func,
      };

    render() {

        if(this.props.onClassify) {
            return <Redirect push to="/classify" />
        }
        if(this.props.onLearn) {
            return <Redirect push to="/learn" />
        }
        if(this.props.onRegister) {
            return <Redirect push to="/register" />
        }
        if(this.props.onLogin) {
            return <Redirect push to="/login" />
        }
        if(this.props.onNotebook) {
            return <Redirect push to="/notebook/" />
        }
        if(this.props.onAnalysis) {
            return <Redirect push to="/analysis/" />
        }

        return (
            <main>
                <Header location={this.props.location} />
                <div className='landing-hero-container'>
                    <div className='landing-hero'>
                        <h2 className='landing-title'>Dive Into Phytoplankton</h2>
                        <p className='landing-subtitle'>Identify phytoplankton types photographed by a robot! Help us monitor the ever-changing marine environment.</p>
                        <div>
                            <button className='landing-hero-button' onClick={this.props.goto_learn}>Learn More</button>
                            <button className='landing-hero-button' onClick={this.props.goto_classify}>Classify</button>
                        </div>
                    </div>
                </div>
                <div className='landing-content'>
                    <div className='main-panel'>
                        <div className='hor-section'>
                            <img className='hor-image' src={ditylum} alt='The community science webpage, which features a title reading "Classify Phytoplankton," a gallery of blank and white microscope images of phytoplankton, and a menu of phytoplankton classification names.'></img>
                            <div className='hor-text'>
                                <h2 className='section-heading'>The Classification Project</h2>
                                <p className='section-body'>Our community classification tool is expanding phytoplankton identification to everyone. It's a network of community scientists making real change in studying the ocean, tracking harmful algae blooms, and more.</p>
                            </div>
                        </div>
                        <div className='side-text'>
                            <h2 className='side-heading'>You can make a difference for our oceans.</h2>
                            <p className='side-body'>Community scientists have the potential to drive marine data collection.</p>
                        </div>
                        <img className='website-preview' src={preview} alt='A preview of the classification webpage, which includes a tutorial, buttons for picking plankton sample, images for classification, and more.'></img>
                        <div className='get-involved-section'>
                        <img src={ifcbGallery} alt="Cursor clicking plankton images to identify them" width="80" loop="infinite" className="ifcb-gallery"></img>
                            <div className='side-text'>
                                <h2 className='side-heading get-involved-heading'>Get Involved</h2>
                                <p className='side-body'>Make an account and start classifying! No experience necessary. Explore the beautiful world of phytoplankton while making real contributions to scientific discovery and ocean conservation.</p>
                                <button className='landing-button' onClick={this.props.goto_classify}>Start Now</button>
                            </div>
                        </div>
                    </div>
                    <div className='external-container'>
                        <div className='vert-section'>
                            <img src={centric} alt="A circular phytoplankton with a bubblewrap-like texture" className="vert-image"></img>
                            <div className='vert-text'>
                                <h2 className='vert-heading'>Phytoplankton</h2>
                                <p className='vert-body'>Phytoplankton are microscopic organisms that drive the ocean food chain.</p>
                            </div>
                            <button className='external-button' onClick={this.props.goto_learn}>Learn More</button>
                        </div>
                        <div className='vert-section righthand-container'>
                            <img src={chaetoceros} alt="A translucent, pillow-like phytoplankton with a dark circular middle" className="vert-image"></img>
                            <div className='vert-text'>
                                <h2 className='vert-heading'>The IFCB</h2>
                                <p className='vert-body'>IFCBs are robotic microscopes that collect water and take pictures without a human.</p>
                            </div>
                            <button className='external-button' onClick={this.props.goto_learn}>Learn More</button>
                        </div>
                        <div className='vert-section righthand-container'>
                            <img src={lithodesmium} alt="A translucent, pillow-like phytoplankton with a dark circular middle" className="vert-image"></img>
                            <div className='vert-text'>
                                <h2 className='vert-heading'>The Kudela Lab</h2>
                                <p className='vert-body'>We use satellites, robots, and good old fashioned chemistry to understand phytoplankton.</p>
                            </div>
                            <button className='external-button' onClick={this.props.goto_learn}>Learn More</button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    onClassify: state.menu.onClassify,
    onLearn: state.menu.onLearn,
    onRegister: state.menu.onRegister,
    onLogin: state.menu.onLogin,
    onNotebook: state.menu.onNotebook,
    onAnalysis: state.menu.onAnalysis,
 });

 export default connect(mapStateToProps, { goto_learn, goto_classify })(Landing);