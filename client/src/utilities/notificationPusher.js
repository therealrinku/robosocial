import firestore from "../firebase/firestore";

const notificationPusher = (owner_uid) => {
  firestore
    .collection(owner_uid)
    .doc("notifications")
    .get((doc1) => {
      firestore
        .collection(owner_uid)
        .doc("notifications")
        .set({
          notifications: [...doc1.data().notifications, { new: true }],
        });
    });
};

export default notificationPusher;