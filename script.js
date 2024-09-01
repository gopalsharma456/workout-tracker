// load all workouts if saved previously
document.addEventListener("DOMContentLoaded", loadWorkouts);

// form handling
document
  .getElementById("workout-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const type = document.getElementById("type").value;
    const duration = document.getElementById("duration").value;

    if (!date || !type || !duration) {
      alert("Please fill out all fields.");
      return;
    }

    const workout = { date, type, duration: parseInt(duration, 10) };

    addWorkoutToList(workout);
    saveWorkoutToLocalStorage(workout);
    updateDashboard();
    document.getElementById("workout-form").reset();
  });

// on DOM load get workouts from local storage
function loadWorkouts() {
  const workouts = getWorkoutsFromLocalStorage();
  workouts.forEach(addWorkoutToList);
  updateDashboard();
}

// update li items
function addWorkoutToList(workout) {
  const workoutList = document.getElementById("workouts");
  const listItem = document.createElement("li");
  listItem.textContent = `${workout.date} - ${workout.type} - ${workout.duration} minutes`;
  workoutList.appendChild(listItem);
}

function saveWorkoutToLocalStorage(workout) {
  const workouts = getWorkoutsFromLocalStorage();
  workouts.push(workout);
  localStorage.setItem("workouts", JSON.stringify(workouts));
}

function getWorkoutsFromLocalStorage() {
  const workouts = localStorage.getItem("workouts");
  return workouts ? JSON.parse(workouts) : [];
}

function updateDashboard() {
  const workouts = getWorkoutsFromLocalStorage();
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce(
    (sum, workout) => sum + workout.duration,
    0
  );
  const currentStreak = calculateCurrentStreak(workouts);

  document.getElementById("total-workouts").textContent = totalWorkouts;
  document.getElementById("total-duration").textContent = totalDuration;
  document.getElementById("current-streak").textContent = currentStreak;
}

function calculateCurrentStreak(workouts) {
  if (workouts.length === 0) return 0;

  workouts.sort((a, b) => new Date(a.date) - new Date(b.date));

  let streak = 1;
  for (let i = workouts.length - 1; i > 0; i--) {
    const currentDate = new Date(workouts[i].date);
    const previousDate = new Date(workouts[i - 1].date);
    const diffTime = currentDate - previousDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
    } else if (diffDays > 1) {
      break;
    }
  }
  return streak;
}
