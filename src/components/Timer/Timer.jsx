import { useState, useEffect } from "react";
import "../Timer/Timer.css";

export default function Timer({ endTime }) {
    const calculateTimeLeft = () => {
        const difference = +new Date(endTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    if (!timeLeft || Object.keys(timeLeft).length === 0) {
        return <span className="auction-closed">AUCTION CLOSED</span>;
    }

 // ... (rest of the component code above is unchanged)

    return (
        <div className="countdown-timer">
            {/* Added a text label for context */}
           {/* // <p className="timer-label-text">AUCTION ENDS IN</p>///// */}
            
            <div className="time-segments-wrapper"> {/* New wrapper for H:M:S */}
                <div className="time-block">
                    <span className="time-value">
                        {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="time-label">HOURS</span>
                </div>
                <span className="colon">:</span>
                <div className="time-block">
                    <span className="time-value">
                        {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="time-label">MINUTES</span>
                </div>
                <span className="colon">:</span>
                <div className="time-block">
                    <span className="time-value">
                        {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="time-label">SECONDS</span>
                </div>
            </div>
        </div>
    );
}