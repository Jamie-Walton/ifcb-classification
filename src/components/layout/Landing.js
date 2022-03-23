import React, { Component } from "react";
import { Link,  Redirect } from "react-router-dom";

export class Landing extends Component {

    render() {
        return (
            <main>
                <div className='landing-hero-cover'>
                    <div className='landing-hero'>
                        <h2>Dive Into Phytoplankton</h2>
                        <p>Identify phytoplankton types photographed by a robot! Help us monitor the ever-changing marine environment.</p>
                    </div>
                </div>
            </main>
        );
    }
}

export default Landing;