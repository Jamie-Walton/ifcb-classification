import React from "react";
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react-dom";
import akashiwo from "../../assets/akashiwo-character.png";
import "../../css/classify-styles.css";

class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toc: [
                {id: 0, title: "Welcome!", text: "Let's get started classifying phytoplankton.", buttons: null},
                {id: 1, title: "Select a sample", text: "Each IFCB collects samples throughout the day full of phytoplankton images it captured. Right now, you’re seeing the latest sample. If you would like to load a new one, use the menu on the left to select a day and an IFCB location.", buttons: null},
                {id: 2, title: "The AutoClassifier", text: "Each sample is run through an auto-clasification algorithm, which identifies each phytoplankton image. But the algorithm isn’t always right: that’s where you come in!", buttons: null},
                {id: 3, title: "Start categorizing", text: "Your first task is to find the images that the AutoClassifier misidentified. Use the menu on the left to navigate to the classifications. In each one, click on the images that don’t belong, using the guide to determine what qualifies and what doesn’t.", buttons: null},
                {id: 4, title: "What if you're unsure?", text: "If you’re ever torn on whether an image belongs or not, just leave it in its original category. But also remember that our scientists check over your classifications before using them, so you will never ruin data if you misidentify an image.", buttons: null},
                {id: 5, title: "Switch modes", text: "When you finish, hit the 'Finished Categorizing' button so we know the file is complete. If you’re up for a challenge, switch over to identify mode using the toggle bar above the images.", buttons: null},
                {id: 6, title: "Start identifying", text: "Now you’ll see all the images that you marked as misidentified or that the AutoClassifier couldn’t figure out in the first place. Select a classification in the left menu, then click on all the images that match it. Make sure to hit the finish button when you're done!", buttons: null},
                {id: 7, title: "Try another method", text: "You can also work the other way: choose an image, then hover over the classifications in the left menu until you find the one that matches it. Select on the classification, then click on the image to classify it. Either method is a good way to identify phytoplankton: find which one works best for you!", buttons: null},
                {id: 8, title: "What if you're unsure?", text: "Again, if you’re not sure where an image belongs, just leave it unclassified. If you’re finding that identify mode is too challenging, you can always stick to just categorizing.", buttons: null},
                {id: 9, title: 'Congrats!', text: "You’re ready to dive in. When you finish a sample, load up a new one! You can always revisit this tutorial if you need any help.", buttons: null},
            ],
            tracks: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            ],
            slide: 0,
            track: 0,
        }
    }

    back() {
        const i = this.state.tracks[this.state.track].findIndex(slide => slide === this.state.slide);
        const slide = this.state.tracks[this.state.track][i-1];
        this.setState({ slide: slide });
    }

    next() {
        const i = this.state.tracks[this.state.track].findIndex(slide => slide === this.state.slide);
        const slide = this.state.tracks[this.state.track][i+1];
        this.setState({ slide: slide });
    }

    handleButton(track) {
        const prevTrack = this.state.track;
        this.setState({ track: track });
        const i = this.state.tracks[prevTrack].findIndex(slide => slide === this.state.slide);
        const slide = this.state.tracks[track][i+1];
        this.setState({ slide: slide });
    }

    render() {

        const slide = this.state.toc[this.state.slide];

        return (
            <div className="public-time-controls">
                <img src={akashiwo} alt="Drawing of a celebratory phytoplankton" className="akashiwo-character"></img>
                <div id={"tutorial-1"} className="visible-tutorial-text">
                    <p className="tutorial-title">{slide.title}</p>
                    <p className="tutorial-body">{slide.text}</p>
                    {slide.buttons ? <div className='tutorial-button-container'>{slide.buttons.map((button) => <div key={button.track} className='tutorial-button' onClick={() => this.handleButton(button.track)}>{button.text}</div>)}</div> : <div/>}
                    <div className='tutorial-nav-container'>
                        {this.state.slide > 0 ? <p className="tutorial-back" onClick={() => this.back()}>{'< Back'}</p> : <div/>}
                        {this.state.slide < this.state.toc.length - 1 && !slide.buttons ? <p className="tutorial-next" onClick={() => this.next()}>{'Next >'}</p> : <div/>}
                    </div>
                </div>
            </div>
        );


    }
}

export default (Tutorial);