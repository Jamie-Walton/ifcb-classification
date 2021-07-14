var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import axios from "axios";
import Draggable from 'react-draggable';

import loader from "./loader.GIF";
import toTop from "./icons/to-top.png";
import dropdown from "./icons/dropdown.png";
/*
import calendar from "./icons/calendar.png";
import dropup from "./icons/dropup.png";
import selectGray from "./icons/select-gray.png";
import selectWhite from "./icons/select-white.png";
*/

var TimeSeriesControl = function (_React$Component) {
    _inherits(TimeSeriesControl, _React$Component);

    function TimeSeriesControl() {
        _classCallCheck(this, TimeSeriesControl);

        return _possibleConstructorReturn(this, (TimeSeriesControl.__proto__ || Object.getPrototypeOf(TimeSeriesControl)).apply(this, arguments));
    }

    _createClass(TimeSeriesControl, [{
        key: "handleDropdown",
        value: function handleDropdown() {
            document.getElementById('timeseries_dropdown').classList.toggle('show');
            document.getElementById('timeseries_label').classList.toggle('hide');
            document.getElementById('timeseries_bar').classList.toggle('accommodate-dropdown');
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var options = this.props.options.map(function (x) {
                return React.createElement(
                    "li",
                    { key: x, onClick: function onClick() {
                            return _this2.props.onClick(x);
                        } },
                    React.createElement(
                        "button",
                        { id: x },
                        x
                    )
                );
            });
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "time", id: "timeseries_bar" },
                    React.createElement(
                        "p",
                        { className: "time-selection" },
                        this.props.timeseries
                    ),
                    React.createElement("img", { src: dropdown, className: "time-icon",
                        alt: 'Select time series', onClick: function onClick() {
                            return _this2.handleDropdown();
                        } })
                ),
                React.createElement(
                    "div",
                    { className: "time-dropdown", id: "timeseries_dropdown" },
                    React.createElement(
                        "ul",
                        { className: "timeseries-option" },
                        options
                    )
                ),
                React.createElement(
                    "p",
                    { className: "time-label", id: "timeseries_label" },
                    "Time Series"
                )
            );
        }
    }]);

    return TimeSeriesControl;
}(React.Component);

var YearControl = function (_React$Component2) {
    _inherits(YearControl, _React$Component2);

    function YearControl() {
        _classCallCheck(this, YearControl);

        return _possibleConstructorReturn(this, (YearControl.__proto__ || Object.getPrototypeOf(YearControl)).apply(this, arguments));
    }

    _createClass(YearControl, [{
        key: "handleDropdown",
        value: function handleDropdown() {
            document.getElementById('year_dropdown').classList.toggle('show');
            document.getElementById('year_label').classList.toggle('hide');
            document.getElementById('year_bar').classList.toggle('accommodate-dropdown');
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            var options = this.props.options.map(function (x) {
                return React.createElement(
                    "li",
                    { key: x, onClick: function onClick() {
                            return _this4.props.onClick(x);
                        } },
                    React.createElement(
                        "button",
                        { id: x },
                        x
                    )
                );
            });
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "time", id: "year_bar" },
                    React.createElement(
                        "p",
                        { className: "time-selection" },
                        this.props.year
                    ),
                    React.createElement("img", { src: dropdown, className: "time-icon",
                        alt: 'Select Year', onClick: function onClick() {
                            return _this4.handleDropdown();
                        } })
                ),
                React.createElement(
                    "div",
                    { className: "time-dropdown", id: "year_dropdown" },
                    React.createElement(
                        "ul",
                        { className: "year-option" },
                        options
                    )
                ),
                React.createElement(
                    "p",
                    { className: "time-label", id: "year_label" },
                    "Year"
                )
            );
        }
    }]);

    return YearControl;
}(React.Component);

var DayControl = function (_React$Component3) {
    _inherits(DayControl, _React$Component3);

    function DayControl() {
        _classCallCheck(this, DayControl);

        return _possibleConstructorReturn(this, (DayControl.__proto__ || Object.getPrototypeOf(DayControl)).apply(this, arguments));
    }

    _createClass(DayControl, [{
        key: "handleDropdown",
        value: function handleDropdown() {
            document.getElementById('day_dropdown').classList.toggle('show');
            document.getElementById('day_label').classList.toggle('hide');
            document.getElementById('day_bar').classList.toggle('accommodate-dropdown');
        }
    }, {
        key: "render",
        value: function render() {
            var _this6 = this;

            var options = this.props.options.map(function (x) {
                return React.createElement(
                    "li",
                    { key: x, onClick: function onClick() {
                            return _this6.props.onClick(x);
                        } },
                    React.createElement(
                        "button",
                        { id: x },
                        x
                    )
                );
            });
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "time", id: "day_bar" },
                    React.createElement(
                        "p",
                        { className: "time-selection" },
                        this.props.day
                    ),
                    React.createElement("img", { src: dropdown, className: "time-icon",
                        alt: 'Select Day', onClick: function onClick() {
                            return _this6.handleDropdown();
                        } })
                ),
                React.createElement(
                    "div",
                    { className: "time-dropdown", id: "day_dropdown" },
                    React.createElement(
                        "ul",
                        { className: "day-option" },
                        options
                    )
                ),
                React.createElement(
                    "p",
                    { className: "time-label", id: "day_label" },
                    "Day"
                )
            );
        }
    }]);

    return DayControl;
}(React.Component);

var FileControl = function (_React$Component4) {
    _inherits(FileControl, _React$Component4);

    function FileControl() {
        _classCallCheck(this, FileControl);

        return _possibleConstructorReturn(this, (FileControl.__proto__ || Object.getPrototypeOf(FileControl)).apply(this, arguments));
    }

    _createClass(FileControl, [{
        key: "handleDropdown",
        value: function handleDropdown() {
            document.getElementById('file_dropdown').classList.toggle('show');
            document.getElementById('file_label').classList.toggle('hide');
            document.getElementById('file_bar').classList.toggle('accommodate-dropdown');
        }
    }, {
        key: "render",
        value: function render() {
            var _this8 = this;

            var options = this.props.options.map(function (x) {
                return React.createElement(
                    "li",
                    { key: x, onClick: function onClick() {
                            return _this8.props.onClick(x);
                        } },
                    React.createElement(
                        "button",
                        { id: x },
                        x
                    )
                );
            });
            var fileName = this.props.file;
            var file = fileName.slice(9, 12) + ':' + fileName.slice(12, 14) + ':' + fileName.slice(14, 16) + 'Z';
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "time", id: "file_bar" },
                    React.createElement(
                        "p",
                        { className: "time-selection" },
                        file
                    ),
                    React.createElement("img", { src: dropdown, className: "time-icon",
                        alt: 'Select File', onClick: function onClick() {
                            return _this8.handleDropdown();
                        } })
                ),
                React.createElement(
                    "div",
                    { className: "time-dropdown", id: "file_dropdown" },
                    React.createElement(
                        "ul",
                        { className: "file-option" },
                        options
                    )
                ),
                React.createElement(
                    "p",
                    { className: "time-label", id: "file_label" },
                    "File"
                )
            );
        }
    }]);

    return FileControl;
}(React.Component);

var SetControl = function (_React$Component5) {
    _inherits(SetControl, _React$Component5);

    function SetControl() {
        _classCallCheck(this, SetControl);

        return _possibleConstructorReturn(this, (SetControl.__proto__ || Object.getPrototypeOf(SetControl)).apply(this, arguments));
    }

    _createClass(SetControl, [{
        key: "handleDropdown",
        value: function handleDropdown() {
            document.getElementById('set_dropdown').classList.toggle('show');
            document.getElementById('set_label').classList.toggle('hide');
            document.getElementById('set_bar').classList.toggle('accommodate-dropdown');
        }
    }, {
        key: "render",
        value: function render() {
            var _this10 = this;

            var classList = this.props.options.sort();
            var options = classList.map(function (x) {
                return React.createElement(
                    "li",
                    { key: x, onClick: function onClick() {
                            return _this10.props.onClick(x);
                        } },
                    React.createElement(
                        "button",
                        { id: x },
                        x
                    )
                );
            });
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "set", id: "set_bar" },
                    React.createElement(
                        "p",
                        { className: "time-selection" },
                        this.props.set
                    ),
                    React.createElement("img", { src: dropdown, className: "time-icon",
                        alt: 'Select Set', onClick: function onClick() {
                            return _this10.handleDropdown();
                        } })
                ),
                React.createElement(
                    "div",
                    { className: "set-dropdown", id: "set_dropdown" },
                    React.createElement(
                        "ul",
                        { className: "set-option" },
                        options
                    )
                ),
                React.createElement(
                    "p",
                    { className: "time-label", id: "set_label" },
                    "Set"
                )
            );
        }
    }]);

    return SetControl;
}(React.Component);

var PlanktonImage = function (_React$Component6) {
    _inherits(PlanktonImage, _React$Component6);

    function PlanktonImage() {
        _classCallCheck(this, PlanktonImage);

        return _possibleConstructorReturn(this, (PlanktonImage.__proto__ || Object.getPrototypeOf(PlanktonImage)).apply(this, arguments));
    }

    _createClass(PlanktonImage, [{
        key: "render",
        value: function render() {
            var url = this.props.nameSpace + this.props.timestamp + '_' + this.props.ifcb + '_' + this.props.targetNum + '.jpg';
            return React.createElement("img", { src: url, className: "image",
                alt: this.props.classification,
                id: this.props.targetNum + '-image',
                style: { height: String(Number(this.props.width) * Number(this.props.scale) * 0.07) + 'vw' } });
        }
    }]);

    return PlanktonImage;
}(React.Component);

var Plankton = function (_React$Component7) {
    _inherits(Plankton, _React$Component7);

    function Plankton() {
        _classCallCheck(this, Plankton);

        return _possibleConstructorReturn(this, (Plankton.__proto__ || Object.getPrototypeOf(Plankton)).apply(this, arguments));
    }

    _createClass(Plankton, [{
        key: "renderImage",
        value: function renderImage() {
            return React.createElement(PlanktonImage, {
                nameSpace: 'http://128.114.25.154:8888/' + this.props.ifcb + '/',
                timestamp: this.props.timestamp,
                ifcb: this.props.ifcb,
                targetNum: this.props.targetNum,
                classification: this.props.classification,
                width: this.props.width,
                scale: this.props.scale
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this13 = this;

            return React.createElement(
                "button",
                { className: "plankton-button", onClick: function onClick() {
                        return _this13.props.onClick(_this13.props.targetNum);
                    } },
                React.createElement(
                    "div",
                    { className: "plankton" },
                    this.renderImage(),
                    React.createElement(
                        "div",
                        { className: 'id', id: this.props.targetNum },
                        React.createElement(
                            "p",
                            { className: 'id-text', id: this.props.targetNum + '-text' },
                            this.props.classification
                        )
                    )
                )
            );
        }
    }]);

    return Plankton;
}(React.Component);

var Micrometer = function (_React$Component8) {
    _inherits(Micrometer, _React$Component8);

    function Micrometer() {
        _classCallCheck(this, Micrometer);

        return _possibleConstructorReturn(this, (Micrometer.__proto__ || Object.getPrototypeOf(Micrometer)).apply(this, arguments));
    }

    _createClass(Micrometer, [{
        key: "render",
        value: function render() {
            return React.createElement(
                Draggable,
                null,
                React.createElement(
                    "div",
                    { className: "drag-box" },
                    React.createElement("div", { className: "micrometer-block",
                        style: { width: '1.904vw' } }),
                    React.createElement(
                        "p",
                        { className: "micrometer-text" },
                        "10\xB5m"
                    )
                )
            );
        }
    }]);

    return Micrometer;
}(React.Component);

var ClassMenu = function (_React$Component9) {
    _inherits(ClassMenu, _React$Component9);

    function ClassMenu() {
        _classCallCheck(this, ClassMenu);

        return _possibleConstructorReturn(this, (ClassMenu.__proto__ || Object.getPrototypeOf(ClassMenu)).apply(this, arguments));
    }

    _createClass(ClassMenu, [{
        key: "render",
        value: function render() {
            var _this16 = this;

            var options = this.props.classes.map(function (x) {
                return React.createElement(
                    "li",
                    { key: x },
                    React.createElement(
                        "button",
                        { id: x, onClick: function onClick() {
                                return _this16.props.onClick(x);
                            } },
                        x
                    )
                );
            });
            return React.createElement(
                "div",
                { className: "sidebar" },
                React.createElement(
                    "div",
                    { className: "class-menu" },
                    React.createElement(
                        "div",
                        { className: "control-box" },
                        React.createElement(
                            "div",
                            { className: "annotation-control", onClick: function onClick() {
                                    return _this16.props.handleSelectAllClick();
                                } },
                            React.createElement(
                                "p",
                                { className: "control-text" },
                                "Select All"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "annotation-control", onClick: function onClick() {
                                    return _this16.props.handleSelectAllClick();
                                } },
                            React.createElement(
                                "p",
                                { className: "control-text" },
                                "Undo"
                            )
                        )
                    ),
                    React.createElement(
                        "ul",
                        null,
                        options
                    )
                ),
                React.createElement(Micrometer, null)
            );
        }
    }]);

    return ClassMenu;
}(React.Component);

var Annotations = function (_React$Component10) {
    _inherits(Annotations, _React$Component10);

    function Annotations(props) {
        _classCallCheck(this, Annotations);

        var _this17 = _possibleConstructorReturn(this, (Annotations.__proto__ || Object.getPrototypeOf(Annotations)).call(this, props));

        _this17.state = {
            loading: true,
            classes: [],
            classPicker: 'Unclassified',
            bin: { timeseries: '', year: '', day: '', file: '' },
            set: 1,
            timeSeriesOptions: [],
            yearOptions: [],
            dayOptions: [],
            fileOptions: [],
            setOptions: [],
            targets: [],
            scale: 1
        };
        return _this17;
    }

    _createClass(Annotations, [{
        key: "getNewTimeSeries",
        value: function getNewTimeSeries(option) {
            var _this18 = this;

            this.setState({ loading: true });
            axios.get('/process/timeseries/' + option + '/').then(function (binResponse) {
                _this18.setState({
                    bin: binResponse.data.bin,
                    set: binResponse.data.set.number,
                    yearOptions: binResponse.data.options.year_options.reverse(),
                    dayOptions: binResponse.data.options.day_options.reverse(),
                    fileOptions: binResponse.data.options.file_options,
                    setOptions: binResponse.data.options.set_options
                });
                axios.get('/process/targets/' + option + '/' + binResponse.data.bin.file + '/1/').then(function (targetResponse) {
                    _this18.setState({
                        targets: targetResponse.data,
                        scale: targetResponse.data[0].scale,
                        loading: false
                    });
                });
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this19 = this;

            axios.get("/api/timeseries/").then(function (res) {
                _this19.setState({ timeSeriesOptions: res.data.map(function (c) {
                        return c.name;
                    }) });
            }).catch(function (err) {
                return console.log(err);
            });

            axios.get("/api/classes/").then(function (res) {
                return _this19.setState({ classes: res.data.map(function (c) {
                        return c.name;
                    }) });
            }).catch(function (err) {
                return console.log(err);
            });

            this.getNewTimeSeries('IFCB104');
        }
    }, {
        key: "getNewYear",
        value: function getNewYear(option) {
            console.log(option);
        }
    }, {
        key: "handleNewDay",
        value: function handleNewDay(option) {
            var _this20 = this;

            document.getElementById('day_dropdown').classList.toggle('show');
            document.getElementById('day_label').classList.toggle('hide');
            document.getElementById('day_bar').classList.toggle('accommodate-dropdown');

            this.setState({
                loading: true,
                bin: {
                    timeseries: this.state.bin.timeseries,
                    year: this.state.bin.year,
                    day: option,
                    file: this.state.bin.file
                },
                set: 1
            });
            axios.get('/process/day/' + this.state.bin.timeseries + '/' + this.state.bin.year + '/' + option + '/').then(function (dayResponse) {
                _this20.setState({
                    bin: {
                        timeseries: _this20.state.bin.timeseries,
                        year: _this20.state.bin.year,
                        day: option,
                        file: _this20.dayResponse.bin.file
                    },
                    fileOptions: dayResponse.data.options.file_options,
                    setOptions: dayResponse.data.options.set_option
                });
                axios.get('/process/targets/' + _this20.state.bin.timeseries + '/' + _this20.state.bin.file + '/1/').then(function (targetResponse) {
                    _this20.setState({
                        targets: targetResponse.data,
                        scale: targetResponse.data[0].scale,
                        loading: false
                    });
                });
            }).catch(function (err) {
                return console.log(err);
            });
        }
    }, {
        key: "handleNewFile",
        value: function handleNewFile(option) {
            var _this21 = this;

            document.getElementById('file_dropdown').classList.toggle('show');
            document.getElementById('file_label').classList.toggle('hide');
            document.getElementById('file_bar').classList.toggle('accommodate-dropdown');

            var file = 'D' + this.state.bin.year + this.state.bin.day.slice(0, 2) + this.state.bin.day.slice(3, 5) + option.slice(0, 3) + option.slice(4, 6) + option.slice(7, 9);
            this.setState({
                loading: true,
                bin: {
                    timeseries: this.state.bin.timeseries,
                    year: this.state.bin.year,
                    day: this.state.bin.day,
                    file: file
                },
                set: 1
            });
            axios.get('/process/file/' + this.state.bin.timeseries + '/' + file + '/').then(function (res) {
                return _this21.setState({ setOptions: res.data.options.set_options });
            }).catch(function (err) {
                return console.log(err);
            });
            axios.get('/process/targets/' + this.state.bin.timeseries + '/' + file + '/1/').then(function (targetResponse) {
                _this21.setState({
                    targets: targetResponse.data,
                    scale: targetResponse.data[0].scale,
                    loading: false
                });
            });
        }
    }, {
        key: "handleNewSet",
        value: function handleNewSet(option) {
            var _this22 = this;

            this.setState({
                loading: true,
                set: option,
                targets: []
            });
            axios.get('process/targets/' + this.state.bin.timeseries + '/' + this.state.bin.file + '/' + option + '/').then(function (res) {
                _this22.setState({
                    targets: res.data,
                    scale: res.data[0].scale
                });
            }).catch(function (err) {
                return console.log(err);
            });
            this.setState({ loading: false });
        }
    }, {
        key: "handleMouseOver",
        value: function handleMouseOver(element) {
            element.style.backgroundColor = '#16609F';
        }
    }, {
        key: "handleMouseOut",
        value: function handleMouseOut(element) {
            element.style.backgroundColor = '#079CCC';
        }
    }, {
        key: "handleMenuClick",
        value: function handleMenuClick(name) {
            var prevMenu = document.getElementById(this.state.classPicker);
            prevMenu.style.backgroundColor = '#079CCC';
            prevMenu.addEventListener('mouseover', this.handleMouseOver(prevMenu));
            prevMenu.addEventListener('mouseout', this.handleMouseOut(prevMenu));

            var ids = document.getElementsByClassName('id');
            var idTexts = document.getElementsByClassName('id-text');
            for (var i = 0; i < ids.length; i++) {
                if (ids[i].style.backgroundColor !== '#FFFFFF') {
                    ids[i].style.backgroundColor = '#FFFFFF';
                    idTexts[i].style.color = '#4E4E4E';
                }
            }

            this.setState({ classPicker: name });
            var menu = document.getElementById(name);
            menu.removeEventListener('mouseout', this.handleMouseOut(menu));
            menu.style.backgroundColor = '#16609F';

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.state.targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var target = _step.value;

                    if (target.classification === name) {
                        var container = document.getElementById(target.number);
                        var text = document.getElementById(target.number + '-text');
                        container.style.backgroundColor = '#16609F';
                        text.style.color = '#FFFFFF';
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /* Fix this entire function later (will need updates to targets and row calls)
        handleRowClick(row) {
            for (const sample of this.state.rows[row]) {
                this.state.targets[sample] = this.state.classPicker;
                const container = document.getElementById(sample);
                const text = document.getElementById(sample+'_text');
                container.style.backgroundColor = '#16609F';
                text.style.color = '#FFFFFF';
            }
            this.setState({targets: this.state.targets});
        }
        */

    }, {
        key: "backToTop",
        value: function backToTop() {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0;
        }
    }, {
        key: "handleSelectAllClick",
        value: function handleSelectAllClick() {
            var targets = this.state.targets;
            for (var i = 0; i < targets.length; i++) {
                targets[i].classification = this.state.classPicker;
                var container = document.getElementById(targets[i].number);
                var text = document.getElementById(targets[i].number + '-text');
                container.style.backgroundColor = '#16609F';
                text.style.color = '#FFFFFF';
            }
            this.setState({ targets: targets });
        }
    }, {
        key: "handlePlanktonClick",
        value: function handlePlanktonClick(i) {
            var targets = this.state.targets;
            var k = targets.findIndex(function (target) {
                return target.number === i;
            });
            targets[k].classification = this.state.classPicker;
            this.setState({ targets: targets });
            var container = document.getElementById(targets[k].number);
            var text = document.getElementById(targets[k].number + '-text');
            container.style.backgroundColor = '#16609F';
            text.style.color = '#FFFFFF';
            axios.post('/classify', targets[i]).catch(function (err) {
                return console.log(err);
            });
        }
    }, {
        key: "renderTimeSeriesControl",
        value: function renderTimeSeriesControl() {
            var _this23 = this;

            return React.createElement(TimeSeriesControl, {
                timeseries: this.state.bin.timeseries,
                options: this.state.timeSeriesOptions,
                onClick: function onClick(option) {
                    return _this23.getNewTimeSeries(option);
                }
            });
        }
    }, {
        key: "renderYearControl",
        value: function renderYearControl() {
            var _this24 = this;

            return React.createElement(YearControl, {
                year: this.state.bin.year,
                options: this.state.yearOptions,
                onClick: function onClick(option) {
                    return _this24.getNewYear(option);
                }
            });
        }
    }, {
        key: "renderDayControl",
        value: function renderDayControl() {
            var _this25 = this;

            return React.createElement(DayControl, {
                day: this.state.bin.day,
                options: this.state.dayOptions,
                onClick: function onClick(option) {
                    return _this25.handleNewDay(option);
                }
            });
        }
    }, {
        key: "renderFileControl",
        value: function renderFileControl() {
            var _this26 = this;

            return React.createElement(FileControl, {
                file: this.state.bin.file,
                options: this.state.fileOptions,
                onClick: function onClick(option) {
                    return _this26.handleNewFile(option);
                }
            });
        }
    }, {
        key: "renderSetControl",
        value: function renderSetControl() {
            var _this27 = this;

            return React.createElement(SetControl, {
                set: this.state.set,
                options: this.state.setOptions,
                onClick: function onClick(option) {
                    return _this27.handleNewSet(option);
                }
            });
        }
    }, {
        key: "renderPlankton",
        value: function renderPlankton(i) {
            var _this28 = this;

            return React.createElement(Plankton, {
                ifcb: this.state.bin.timeseries,
                timestamp: this.state.bin.file,
                id: i,
                targetNum: this.state.targets[i].number,
                classification: this.state.targets[i].classification,
                scale: this.state.targets[i].scale,
                width: this.state.targets[i].width,
                onClick: function onClick(i) {
                    return _this28.handlePlanktonClick(i);
                }
            });
        }
    }, {
        key: "renderClassMenu",
        value: function renderClassMenu() {
            var _this29 = this;

            return React.createElement(ClassMenu, {
                classes: this.state.classes,
                onClick: function onClick(name) {
                    return _this29.handleMenuClick(name);
                },
                handleSelectAllClick: function handleSelectAllClick() {
                    return _this29.handleSelectAllClick();
                },
                handleUndoClick: function handleUndoClick() {
                    return _this29.handleUndoClick();
                }
            });
        }
    }, {
        key: "renderMicrometer",
        value: function renderMicrometer() {
            return React.createElement(Micrometer, {
                scale: this.state.scale });
        }
    }, {
        key: "renderLoader",
        value: function renderLoader() {
            return React.createElement("img", { src: loader, alt: "Loading targets...", width: "80", loop: "infinite" });
        }
    }, {
        key: "render",
        value: function render() {
            var _this30 = this;

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "h1",
                    null,
                    "Manual Classifications"
                ),
                React.createElement(
                    "div",
                    { className: "time-controls" },
                    this.renderTimeSeriesControl(),
                    this.renderYearControl(),
                    this.renderDayControl(),
                    this.renderFileControl(),
                    this.renderSetControl()
                ),
                React.createElement(
                    "div",
                    { className: "annotations" },
                    this.renderClassMenu(),
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "image-grid" },
                            this.state.loading ? this.renderLoader() : this.state.targets.map(function (target, i) {
                                return _this30.renderPlankton(i);
                            }),
                            React.createElement("img", { src: toTop, alt: "Back to Top", className: "to-top", onClick: function onClick() {
                                    return _this30.backToTop();
                                } })
                        )
                    )
                )
            );
        }
    }]);

    return Annotations;
}(React.Component);

export default Annotations;