/*To run the freeCodeCamp Tests for 25+5 Clock, the play/pause button
needs to be clicked at least one time after the app is rendered, otherwise
the tests won't be executed. I couldn't find the reason why this happens.*/

const accurateInterval = function (fn, time) {
    var cancel, nextAt, timeout, wrapper;
    nextAt = new Date().getTime() + time;
    timeout = null;
    wrapper = function () {
        nextAt += time;
        timeout = setTimeout(wrapper, nextAt - new Date().getTime());
        return fn();
    };
    cancel = function () {
        return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
        cancel: cancel
    };
};

class LengthControl extends React.Component {
    render() {
        return (
            <div className="length-control-boxes">
                <h3 id={this.props.titleId}>{this.props.title}</h3>
                <div className="length-controls">
                    <button
                        id={this.props.incrementId}
                        value="+"
                        onClick={this.props.function}
                    >
                        <i class="fa-solid fa-plus"></i>
                    </button>
                    <div id={this.props.lengthId}>{this.props.length}</div>
                    <button
                        id={this.props.decrementId}
                        value="-"
                        onClick={this.props.function}
                    >
                        <i class="fa-solid fa-minus"></i>
                    </button>
                </div>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionLength: 25,
            breakLength: 5,
            timerStatus: "stopped",
            timerType: "Session",
            timer: 1500,
            intervalID: ""
        }
        this.handleBreakLength = this.handleBreakLength.bind(this);
        this.handleSessionLength = this.handleSessionLength.bind(this);
        this.timerNormalizer = this.timerNormalizer.bind(this);
        this.decrementTimer = this.decrementTimer.bind(this);
        this.beginCountdown = this.beginCountdown.bind(this);
        this.timerControl = this.timerControl.bind(this);
        this.handleTimerType = this.handleTimerType.bind(this);
        this.reset = this.reset.bind(this);
    }

    handleBreakLength(e) {
        const value = e.target.value;
        if (value === "-") {
            if (this.state.breakLength > 1) {
                this.setState({
                    breakLength: this.state.breakLength - 1
                })
            }
        }
        else {
            if (this.state.breakLength < 60) {
                this.setState({
                    breakLength: this.state.breakLength + 1
                })
            }
        }
    }

    handleSessionLength(e) {
        const value = e.target.value;
        if (value === "-") {
            if (this.state.sessionLength > 1) {
                this.setState({
                    sessionLength: this.state.sessionLength - 1,
                    timer: (this.state.sessionLength - 1) * 60
                })
            }
        }
        else {
            if (this.state.sessionLength < 60) {
                this.setState({
                    sessionLength: this.state.sessionLength + 1,
                    timer: (this.state.sessionLength + 1) * 60
                })
            }
        }
    }

    timerNormalizer() {
        let minutes = Math.floor(this.state.timer / 60);
        let seconds = this.state.timer - minutes * 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        return minutes + ":" + seconds;
    }

    timerControl() {
        if (this.state.timerStatus == "stopped") {
            this.beginCountdown();
            this.setState({
                timerStatus: "running"
            })
        }
        else {
            this.state.intervalID.cancel();
            this.setState({
                timerStatus: "stopped"
            })
        }
    }

    beginCountdown() {
        this.setState({
            intervalID: accurateInterval(() => {
                this.decrementTimer();
                this.handleTimerType();
            }, 1000)
        })
    }

    decrementTimer() {
        this.setState({
            timer: this.state.timer - 1
        });
    }

    handleTimerType() {
        if (this.state.timer < 0) {
            const sound = document.getElementById("beep");
            sound.play();
            if (this.state.timerType == "Session") {
                this.setState({
                    timer: this.state.breakLength * 60,
                    timerType: "Break"
                })
            }
            else {
                this.setState({
                    timer: this.state.sessionLength * 60,
                    timerType: "Session"
                })
            }
        }
    }

    reset() {
        const sound = document.getElementById("beep");
        sound.pause();
        sound.currentTime = 0;
        this.state.intervalID.cancel();
        this.setState({
            sessionLength: 25,
            breakLength: 5,
            timerStatus: "stopped",
            timerType: "Session",
            timer: 1500
        })
    }

    render() {
        return (
            <div id="clock">
                <h2>Pomodoro Clock</h2>
                <div id="length-controls-box">
                    <LengthControl
                        titleId="break-label"
                        title="Break Length"
                        incrementId="break-increment"
                        decrementId="break-decrement"
                        length={this.state.breakLength}
                        lengthId="break-length"
                        function={this.handleBreakLength}
                    />
                    <LengthControl
                        titleId="session-label"
                        title="Session Length"
                        incrementId="session-increment"
                        decrementId="session-decrement"
                        length={this.state.sessionLength}
                        lengthId="session-length"
                        function={this.handleSessionLength}
                    />
                </div>
                <div id="timer-big-box">
                    <button id="start_stop" onClick={this.timerControl}>
                        <i class="fa-solid fa-play"></i>
                        <i class="fa-solid fa-pause"></i>
                    </button>
                    <div id="timer-box">
                        <h3 id="timer-label">{this.state.timerType}</h3>
                        <h3 id="time-left">{this.timerNormalizer()}</h3>
                    </div>
                    <button id="reset" onClick={this.reset}>
                        <i class="fa-solid fa-arrows-rotate"></i>
                    </button>
                    <audio
                        src="https://www.mediacollege.com/downloads/sound-effects/star-trek/tos/tos-intercom.mp3"
                        id="beep"
                    />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app"))