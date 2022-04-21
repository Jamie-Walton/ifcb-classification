import React, { Component } from "react";
import { Link,  Redirect } from "react-router-dom";
import ifcbGallery from "../../assets/ifcb-gallery.png";
import ditylum from "../../assets/ditylum-gradient.png";

export class Landing extends Component {
    // TODO: Make hero into img and add alt text
    // media query smaller version when width is less than 950px
    render() {
        return (
            <main>
                <div className='landing-hero-container'>
                    <div className='landing-hero'>
                        <h2 className='landing-title'>Dive Into Phytoplankton</h2>
                        <p className='landing-subtitle'>Identify phytoplankton types photographed by a robot! Help us monitor the ever-changing marine environment.</p>
                    </div>
                </div>
                <div className='landing-content'>
                    <div className='main-panel'>
                        <div className='hor-section'>
                            <img className='hor-image' src={ditylum} alt='The community science webpage, which features a title reading "Classify Phytoplankton," a gallery of blank and white microscope images of phytoplankton, and a menu of phytoplankton classification names.'></img>
                            <div className='hor-text'>
                                <h2 className='section-heading'>The Classification Project</h2>
                                <p className='section-body'>A description of the project and why it’s important. Include details of the significance of manual classification data collection.</p>
                            </div>
                        </div>
                        <div className='side-text'>
                            <h2 className='side-heading'>You can make a difference for our oceans.</h2>
                            <p className='side-body'>Community scientist contributions drive data collection, etc.</p>
                        </div>
                        <div className='website-preview'></div>
                        <div className='get-involved-section'>
                        <img src={ifcbGallery} alt="Cursor clicking plankton images to identify them" width="80" loop="infinite" className="ifcb-gallery"></img>
                            <div className='side-text'>
                                <h2 className='side-heading get-involved-heading'>Get Involved</h2>
                                <p className='side-body'>Description of how people can start classifying with our site, what experience they need (none!), and what kind of impact they can make.</p>
                                <button className='landing-button'>Learn More</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default Landing;