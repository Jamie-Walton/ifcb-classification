import React from "react";
import akashiwo from "../../assets/akashiwo-character.png";
import "../../css/classify-styles.css";

class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toc: [
                {id: 0, title: "Welcome!", text: "Let's get started classifying phytoplankton.", buttons: null},
                {id: 1, title: "Select a sample", text: "Each IFCB collects samples throughout the day full of phytoplankton images it captured. Load a sample by using the menu on the left to select a day and an IFCB location.", buttons: null},
                {id: 2, title: "The AutoClassifier", text: "Each sample is run through an auto-clasification algorithm. Take a look at the first image. It has a code under it, like 'AKA' or 'UNCL.' This stands for the species name that the Auto Classifier assigned it. UNCL stands for 'unclassified' and it means that the classifier couldn't place it.", buttons: null},
                {id: 3, title: "Does your image match?", text: "Your job is to check whether the classifier is right and classify the plankton it couldn't. Click on the classification name in the menu on the left that matches the code on the first image. Does the classification match your image?", buttons: [{text: 'Yes', track: 0}, {text: 'No', track: 1}, {text: 'Unsure', track: 2}]},
                {id: 4, title: "Fantastic!", text: "You don't need to do anything with this image because it is already correct.", buttons: null},
                {id: 5, title: "Good catch!", text: "Use your mouse to hover over the different names in the menu until you find one that looks like your image. There are a lot of options– you may find that you need to scroll.", buttons: null},
                {id: 6, title: "Good call!", text: "It's always a good idea to be cautious if you're unsure. Use your mouse to hover over the different names in the menu and see if any match better. If you're still not sure, just skip this image– someone else may be able to get it.", buttons: null},
                {id: 7, title: "What if it didn't match?", text: "If the autoclassification ever doesn't match the real classification, it's time to look for the right one. Use your mouse to hover over the different names in the menu until you find one that looks like your image.", buttons: null},
                {id: 8, title: "What if it did match?", text: "If the autoclassification ever matches the real classification, your work is done. Just move on to the next image without changing anything because it's already correct.", buttons: null},
                {id: 9, title: "How about if you're unsure?", text: "If you're ever not sure what classification to give an image after checking the different categories, skip it. It's better to leave it autoclassified or unclassified than guessing.", buttons: null},
                {id: 10, title: "What if it didn't match?", text: "If the autoclassification ever doesn't match the real classification, it's time to look for the right one. Use your mouse to hover over the different names in the menu until you find one that looks like your image.", buttons: null},
                {id: 11, title: 'Congrats!', text: "You're ready to classify. Dive in!", buttons: null},
            ],
            tracks: [
                [0, 1, 2, 3, 4, 7, 9, 11],
                [0, 1, 2, 3, 5, 8, 9, 11],
                [0, 1, 2, 3, 6, 8, 10, 11],
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