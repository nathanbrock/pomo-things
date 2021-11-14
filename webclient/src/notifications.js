export function sendNotifications(messageText) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    else if (Notification.permission === "granted") {
        new Notification(messageText);
    }

    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                new Notification(messageText);
            }
        });
    }
}