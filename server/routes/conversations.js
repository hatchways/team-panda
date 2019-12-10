const express = require("express");
const router = express.Router({ mergeParams: true });
const models = require("../models").default;

module.exports.userConversations = auth => {
    router.get(
        "/",
        auth.authenticate("jwt-param-id", { sessions: false }),
        (req, res, next) => {
            let conversationMessages = {};
            req.user
                .getConversations()
                .then(conversations => {
                    let conversationIds = [];
                    let messagePromises = [];
                    for (let conversation of conversations) {
                        conversationIds.push(conversation.id);
                        messagePromises.push(conversation.getMessages());
                    }
                    Promise.all(promises).then(conversationMessagesList => {
                        for (
                            let i = 0;
                            i < conversationMessagesList.length;
                            i++
                        ) {
                            conversationMessages[conversationIds[i]] =
                                conversationMessagesList[i];
                        }
                    });
                    res.send(conversationMessages);
                })
                .catch(next);
        }
    );

    return router;
};
