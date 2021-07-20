const className = ["play", "pause", "prev", "next", "none"];
const gestureRule = {
    play: {
        className: "play",
        hands: 1,
        fingers: 4,
    },
    pause: {
        className: "pause",
        hands: 1,
        fingers: 0,
    },
    prev: {
        className: "prev",
        hands: 1,
        fingers: 1,
    },
    next: {
        className: "next",
        hands: 1,
        fingers: 3,
    },
    none: {
        className: "none",
        hands: 0,
        fingers: 0,
    },
};
const gestureQueueSize = 3;
const gestureSensitivity = 2;
let gestureArray = [];

let leapObj = {
    hands: 0,
    fingers: 0,
};

let modelPredict = {
    className: "none",
    probability: 0,
};

Leap.loop(function (obj) {
    leapObj.hands = obj.hands.length;
    leapObj.fingers = obj.pointables.length;
});

$(document).ready(function () {
    gestureInit();
    init();

    // timer
    window.setInterval(() => {
        switch (checkGesture()) {
            case "play":
                $("#play-pause-button").click();
                break;
            case "pause":
                $("#play-pause-button").click();
                break;
            case "prev":
                $("#play-previous").click();
                break;
            case "next":
                $("#play-next").click();
                break;
            default:
        }
    }, 500);
});

const checkGesture = () => {
    pushGesture();

    let gestureClass = "none";
    if (gestureArray.length > gestureQueueSize) {
        gestureClass = findMostFreqElement(gestureArray);
        gestureInit();
    }

    console.log(modelPredict);
    console.log(leapObj);
    console.log(gestureArray);

    return gestureClass;
};

const findMostFreqElement = (arr) => {
    return arr
        .sort((a, b) => {
            return (
                arr.filter((e) => e === a).length -
                arr.filter((e) => e === b).length
            );
        })
        .pop();
};

const checkGestureRule = (l, m) => {
    console.log(m.className, gestureRule[m.className]);
    if (
        l.hands === gestureRule[m.className].hands &&
        l.fingers === gestureRule[m.className].fingers
    ) {
        return m.className;
    } else {
        return "none";
    }
};

const gestureInit = () => {
    gestureArray = [];
};

const pushGesture = () => {
    if (gestureArray.length <= gestureQueueSize) {
        gestureArray.push(checkGestureRule(leapObj, modelPredict));
    } else {
        shiftGesture();
        gestureArray.push(checkGestureRule(leapObj, modelPredict));
    }

    return gestureArray.length;
};

const shiftGesture = () => {
    return gestureArray.shift();
};
