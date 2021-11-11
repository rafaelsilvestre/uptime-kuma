const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const Crypto = require("crypto");
const { log } = require("../../src/util");

class Matrix extends NotificationProvider {
    name = "matrix";

    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        let okMsg = "Sent Successfully.";

        const size = 20;
        const randomString = encodeURIComponent(
            Crypto
                .randomBytes(size)
                .toString("base64")
                .slice(0, size)
        );

        log("notification", "Random String: " + randomString, "debug");

        const roomId = encodeURIComponent(notification.internalRoomId);

        log("notification", "Matrix Room ID: " + roomId, "debug");

        try {
            let config = {
                headers: {
                    "Authorization": `Bearer ${notification.accessToken}`,
                }
            };
            let data = {
                "msgtype": "m.text",
                "body": msg
            };

            await axios.put(`${notification.homeserverUrl}/_matrix/client/r0/rooms/${roomId}/send/m.room.message/${randomString}`, data, config);
            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }
}

module.exports = Matrix;
