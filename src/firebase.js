import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyAWzuhGaAbK7bSwxRF9a3YToYANQKUdnUw",
    authDomain: "service-ace.firebaseapp.com",
    databaseURL: "https://service-ace.firebaseio.com",
    projectId: "service-ace",
    storageBucket: "",
    messagingSenderId: "792583582090"
}

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(config);

// Disable deprecated features
firebase.firestore().settings({
    timestampsInSnapshots: true,
});

export default firebase;