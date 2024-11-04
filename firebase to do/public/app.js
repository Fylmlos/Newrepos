// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// References
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Function to add a task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    db.collection('tasks').add({
        text: taskText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        taskInput.value = '';
        loadTasks();  // Reload tasks
    });
}

// Function to load tasks from Firestore
function loadTasks() {
    taskList.innerHTML = ''; // Clear the list
    db.collection('tasks').orderBy('timestamp', 'asc').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const task = doc.data().text;
            const li = document.createElement('li');
            li.innerHTML = `${task} <button onclick="deleteTask('${doc.id}')">Delete</button>`;
            taskList.appendChild(li);
        });
    });
}

// Function to delete a task
function deleteTask(id) {
    db.collection('tasks').doc(id).delete().then(() => {
        loadTasks();  // Reload tasks after deletion
    });
}

// Load tasks on page load
loadTasks();
