const functions = require('firebase-functions');
const admin = require('firebase-admin');
const joi = require('joi');
const co = require('co');

admin.initializeApp(functions.config().firebase);

const getItemOwner = itemId =>
  admin
    .database()
    .ref('/feed')
    .child(itemId)
    .child('user')
    .once('value')
    .then(s => s.val());

const getUser = userId =>
  admin
    .database()
    .ref('/users')
    .child(userId)
    .once('value')
    .then(s => s.val());

const sendNotification = (token, payload) =>
  admin.messaging().sendToDevice(token, payload);

/**
 * Add new users to a custom ref
 */
exports.storeUser = functions.auth.user().onCreate((event) => {
  const user = event.data;
  return admin
    .database()
    .ref('/users')
    .child(user.uid)
    .set(user);
});

/**
 * Validation schema for send token http requests
 */
const fcmSchema = joi.object().keys({
  userId: joi.string().required(),
  token: joi.string().required(),
});

/**
 * send fcm token http endpoint
 */
exports.fcmToken = functions.https.onRequest((req, res) => {
  const { error } = joi.validate(req.body, fcmSchema)
  if (error !== null) {
    return res.status(400).send('Bad Request');
  }

  const { userId, token } = req.body;

  return admin
    .database()
    .ref('/users')
    .child(userId)
    .child('fcmToken')
    .set(token)
    .then(() => res.status(201).end())
    .catch((e) => res.status(500).send(e.message));
});

exports.notiAdded = functions.database.ref('/notif/{ownerId}/{notification}')
  .onWrite((event) => {
    if (event.data.previous.exists()) {
      return;
    }

    if (!event.data.exists()) {
      return;
    }

    const { ownerId } = event.params;
    const { sender: { email } } = event.data.val();

    return co(function* () {
      const owner = yield getUser(ownerId);
      if (!owner.fcmToken) {
        return null;
      }

      const payload = {
        notification: {
          title: 'You got a new like!',
          body: `${email} liked your post`,
        },
      };

      yield sendNotification(owner.fcmToken, payload);
      return null;
    });
  })

exports.itemLiked = functions.database.ref('/feed/{itemId}/likes/{userId}')
  .onWrite((event) => {
    // Only edit data when it is first created.
    if (event.data.previous.exists()) {
      return;
    }

    // Exit when the data is deleted.
    if (!event.data.exists()) {
      return;
    }

    const { itemId, userId } = event.params;

    const notifRef = admin
      .database()
      .ref('/notif');

    return co(function* () {
      const owner = yield getItemOwner(itemId);
      const sender = yield getUser(userId);

      const noti = {
        target: itemId,
        sender
      };

      yield notifRef
        .child(owner.id)
        .push(noti);

      return null;
    });
  });
