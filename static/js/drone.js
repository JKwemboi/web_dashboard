function sendCommand(command) {
    fetch("/drone_control/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify({ command: command })
    })
        .then(res => res.json())
        .then(data => console.log(data));
}

function updateSpeed(value) {
    sendCommand("speed_" + value);
}

function getCSRFToken() {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken'))
        .split('=')[1];
}