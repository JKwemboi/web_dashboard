function sendCommand(command) {
    fetch("/robot_api/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify({ command: command })
    })
        .then(res => {
            if (!res.ok) throw new Error("Command failed");
            return res.json();
        })
        .then(data => console.log(data));
}

function getCSRFToken() {
    const token = document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='));
    return token ? token.split('=')[1] : '';
}
